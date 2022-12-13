import { Workspace, WorkspaceLeaf } from 'obsidian'

export const openView = async (
    workspace: Workspace,
    id: string,
    position?: FramePosition
): Promise<WorkspaceLeaf | undefined> => {
    let leafs = workspace.getLeavesOfType(id)
    if (leafs.length == 0) {
        return createView(workspace, id, position)
    }

    let leaf = workspace.getLeavesOfType(id)[0]
    workspace.revealLeaf(leaf)
    return leaf
}

const createView = (
    workspace: Workspace,
    id: string,
    position?: FramePosition
): WorkspaceLeaf | undefined => {
    let leaf: WorkspaceLeaf | undefined
    switch (position) {
        case 'left':
            leaf = workspace.getLeftLeaf(false)
            break
        case 'center':
            leaf = workspace.getLeaf(false)
            break
        case 'right':
        default:
            leaf = workspace.getRightLeaf(false)
            break
    }

    leaf?.setViewState({ type: id, active: true })

    return leaf
}
