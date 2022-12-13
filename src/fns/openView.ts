import { Workspace, WorkspaceLeaf } from 'obsidian'

export const openView = async (
    workspace: Workspace,
    id: string,
    position?: FramePosition
): Promise<void> => {
    let leafs = workspace.getLeavesOfType(id)
    if (leafs.length == 0) {
        createView(workspace, id, position)
    } else {
        let leaf = workspace.getLeavesOfType(id)[0]
        workspace.revealLeaf(leaf)
    }
}

const createView = (
    workspace: Workspace,
    id: string,
    position?: FramePosition
) => {
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
}
