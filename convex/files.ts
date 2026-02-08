import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { verifyAuth } from "./auth"
import { Id } from "./_generated/dataModel"

export const getFile = query({
  args: {
    id: v.id("files")
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const file = await ctx.db.get("files", args.id)
    if (!file) {
      throw new Error("File not found")
    }

    const project = await ctx.db.get("projects", file.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    return file
  }
})

export const getFiles = query({
  args: {
    projectId: v.id("projects")
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const project = await ctx.db.get("projects", args.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    return await ctx.db.query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect()
  }
})

export const getFolderContents = query({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files"))
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const project = await ctx.db.get("projects", args.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    const files = await ctx.db.query("files")
      .withIndex("by_project_and_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
      .collect()

    // Sort: folders first, then files, alphabetically within each group
    return files.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1
      if (a.type === "file" && b.type === "folder") return 1
      return a.name.localeCompare(b.name)
    })
  }
})

export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const project = await ctx.db.get("projects", args.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    const files = await ctx.db.query("files")
      .withIndex("by_project_and_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
      .collect()

    const existing = files.find((file) => file.name === args.name && file.type === "file")
    if (existing) {
      throw new Error("File already exists")
    }

    await ctx.db.insert("files", {
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: "file",
      content: args.content,
      updatedAt: Date.now()
    })

    await ctx.db.patch("projects", project._id, {
      updatedAt: Date.now()
    })
  }
})

export const createFolder = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const project = await ctx.db.get("projects", args.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    const files = await ctx.db.query("files")
      .withIndex("by_project_and_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
      .collect()

    const existing = files.find((file) => file.name === args.name && file.type === "folder")
    if (existing) {
      throw new Error("Folder already exists")
    }

    await ctx.db.insert("files", {
      projectId: args.projectId,
      parentId: args.parentId,
      name: args.name,
      type: "folder",
      updatedAt: Date.now()
    })

    await ctx.db.patch("projects", project._id, {
      updatedAt: Date.now()
    })
  }
})

export const renameFile = mutation({
  args: {
    id: v.id("files"),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const file = await ctx.db.get("files", args.id)
    if (!file) {
      throw new Error("File not found")
    }

    const project = await ctx.db.get("projects", file.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    const siblings = await ctx.db.query("files")
      .withIndex("by_project_and_parent", (q) => q.eq("projectId", file.projectId).eq("parentId", file.parentId))
      .collect()

    const existing = siblings.find((sibling) => sibling.name === args.name && sibling.type === file.type && sibling._id !== file._id)
    if (existing) {
      throw new Error(`A ${file.type} with this name already exists.`)
    }

    await ctx.db.patch("files", args.id, {
      name: args.name,
      updatedAt: Date.now()
    })

    await ctx.db.patch("projects", project._id, {
      updatedAt: Date.now()
    })
  }
})

export const deleteFile = mutation({
  args: {
    id: v.id("files")
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const file = await ctx.db.get("files", args.id)
    if (!file) {
      throw new Error("File not found")
    }

    const project = await ctx.db.get("projects", file.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    // Recursive delete
    const recursiveDelete = async (fileId: Id<"files">) => {
      const item = await ctx.db.get("files", fileId)
      if (!item) return

      // If it's a folder, recursively delete all its children first
      if (item.type === "folder") {
        const children = await ctx.db.query("files")
          .withIndex("by_project_and_parent", (q) => q.eq("projectId", item.projectId).eq("parentId", fileId))
          .collect()

        for (const child of children) {
          await recursiveDelete(child._id)
        }
      }

      // Delete the storage file if it exists
      if (item.storageId) {
        await ctx.storage.delete(item.storageId)
      }

      // Delete the file/folder itself
      await ctx.db.delete(fileId)
    }

    await recursiveDelete(args.id)

    await ctx.db.patch("projects", project._id, {
      updatedAt: Date.now()
    })
  }
})

export const updateFile = mutation({
  args: {
    id: v.id("files"),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx)

    const file = await ctx.db.get("files", args.id)
    if (!file) {
      throw new Error("File not found")
    }

    const project = await ctx.db.get("projects", file.projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    await ctx.db.patch("files", args.id, {
      content: args.content,
      updatedAt: Date.now()
    })

    await ctx.db.patch("projects", project._id, {
      updatedAt: Date.now()
    })
  }
})