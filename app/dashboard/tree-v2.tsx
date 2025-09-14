import { cn } from '@/lib/utils'
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core'
import { useTree } from '@headless-tree/react'

export const TreeV2 = () => {
    const tree = useTree<string>({
        initialState: { expandedItems: ['folder-1'] },
        rootItemId: 'folder',
        getItemName: (item) => item.getItemData(),
        isItemFolder: (item) => !item.getItemData().endsWith('item'),
        dataLoader: {
            getItem: (itemId) => itemId,
            getChildren: (itemId) => [`${itemId}-folder`, `${itemId}-1-item`, `${itemId}-2-item`]
        },
        indent: 20,
        features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
    })

    return (
        <div {...tree.getContainerProps()} className="tree">
            {tree.getItems().map((item) => (
                <button
                    {...item.getProps()}
                    key={item.getId()}
                    style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
                >
                    <div
                        className={cn('treeitem', {
                            focused: item.isFocused(),
                            expanded: item.isExpanded(),
                            selected: item.isSelected(),
                            folder: item.isFolder()
                        })}
                    >
                        {item.getItemName()}
                    </div>
                </button>
            ))}
        </div>
    )
}
