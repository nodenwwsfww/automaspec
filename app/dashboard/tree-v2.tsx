import {
    createOnDropHandler,
    dragAndDropFeature,
    hotkeysCoreFeature,
    keyboardDragAndDropFeature,
    selectionFeature,
    syncDataLoaderFeature
} from '@headless-tree/core'
import { AssistiveTreeDescription, useTree } from '@headless-tree/react'
import { cn } from '@/lib/utils'
import { DemoItem, createDemoData } from './tree-demo-data'
import { ChevronRight, Folder, File } from 'lucide-react'

const { syncDataLoader, data } = createDemoData()

export const TreeV2 = () => {
    const tree = useTree<DemoItem>({
        initialState: {
            expandedItems: ['fruit'],
            selectedItems: ['banana', 'orange']
        },
        rootItemId: 'root',
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => !!item.getItemData().children,
        canReorder: true,
        onDrop: createOnDropHandler((item, newChildren) => {
            data[item.getId()].children = newChildren
        }),
        indent: 20,
        dataLoader: syncDataLoader,
        features: [
            syncDataLoaderFeature,
            selectionFeature,
            hotkeysCoreFeature,
            dragAndDropFeature,
            keyboardDragAndDropFeature
        ]
    })

    return (
        <>
            <div {...tree.getContainerProps()} className="">
                <AssistiveTreeDescription tree={tree} />
                {tree.getItems().map((item) => (
                    <button
                        key={item.getId()}
                        {...item.getProps()}
                        className="flex w-full"
                        style={{ paddingLeft: `${item.getItemMeta().level * 2}rem` }}
                    >
                        <div
                            className={cn(
                                'w-full text-left px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-muted flex items-center gap-2',
                                {
                                    focused: item.isFocused(),
                                    expanded: item.isExpanded(),
                                    selected: item.isSelected(),
                                    folder: item.isFolder(),
                                    drop: item.isDragTarget(),
                                    'bg-muted': item.isFocused() || item.isSelected() || item.isDragTarget()
                                }
                            )}
                        >
                            {item.isFolder() ?
                                <>
                                    <ChevronRight
                                        className={cn('size-4 transition-transform duration-100 ease-in-out', {
                                            'rotate-90': item.isExpanded()
                                        })}
                                    />
                                    <Folder className="size-4 text-blue-500" />
                                </>
                            :   <>
                                    <div className="size-4" />
                                    <File className="size-4 text-gray-500" />
                                </>
                            }
                            <span>{item.getItemName()}</span>
                        </div>
                    </button>
                ))}
                <div
                    style={tree.getDragLineStyle()}
                    className="h-0.5 -mt-0.5 bg-[#0366d6] before:content-[''] before:absolute before:left-0 before:-top-1 before:h-1 before:w-1 before:bg-white before:border-2 before:border-[#0366d6] before:rounded-full"
                />
            </div>
        </>
    )
}
