import * as treeDAO from "./tree.dao";
import * as contentDAO from "../content/content.dao";
import * as employeeDAO from "../employee/employee.dao";
import * as nodeDAO from "./node/node.dao";
import { Tree } from "./tree.model";
import { CreateTreeDTO } from "./dto/create-tree.dto";
import { UpdateTreeDTO } from "./dto/update-tree.dto";
import { RowDataPacket } from "mysql2";
import { GraphNode } from "../content/graph-node.model";
import { Content, ContentType } from "../content/content.model";
import { Employee, Role } from "../employee/employee.model";
import { FilterTreeDTO } from "./dto/filter-tree.dto";
import { ForbiddenException } from "../../../exceptions/ForbiddenException";
import { NotFoundException } from "../../../exceptions/NotFoundException";
import { DeleteResult } from "typeorm";

export const findAll = async (
    filter: FilterTreeDTO,
    employee: Employee
): Promise<Tree[]> => {
    const isRequestingConceptTrees =
        filter.concept === undefined || filter.concept == true;

    if (!employee && isRequestingConceptTrees)
        throw new ForbiddenException(
            "You should be logged in to access concept trees"
        );

    return treeDAO.findAll(filter);
};

export const findByID = async (id: number): Promise<Tree> => {
    const tree = await treeDAO.findByID(id);

    if (!tree) throw new NotFoundException("Tree does not exist");

    return tree;
};

// export const findByIDWithContent = async (id: number): Promise<Tree> => {
//     const tree: Tree = await treeDAO.findByID(id);
//     const content: GraphNode = await contentDAO.findRecursively(id);
//     const creator: Employee = await employeeDAO.findByID(
//         tree.creator as number
//     );

//     delete creator.password;

//     tree.rootNode = content;
//     tree.creator = creator;

//     return tree;
// };

export const create = async (
    dto: CreateTreeDTO,
    creator: number
): Promise<Tree> => {
    const tree: Tree = await treeDAO.create(dto, creator);

    return tree;
};

export const remove = async (id: number): Promise<void> => {
    const result: DeleteResult = await treeDAO.remove(id);

    if (result.affected === 0)
        throw new NotFoundException("Tree does not exist");
};

export const update = async (id: number, dto: UpdateTreeDTO): Promise<Tree> => {
    return treeDAO.update(id, dto);
};

// export const copy = async (
//     fromTreeID: number,
//     toTreeID: number
// ): Promise<void> => {
//     // Request the tree from the DAO
//     const graph: GraphNode = await contentDAO.findRecursively(fromTreeID);
//     console.log(graph);

//     // Create a lookup table of old ids to new ids
//     const parentCache: {
//         [nodeID: number]: number;
//     } = {};

//     /* Recursive function to copy nodes to the new tree.
//      * Every node will call this on all its children.
//      * The function is local to prevent it from leaking to other scopes
//      */
//     async function transform(node: GraphNode): Promise<void> {
//         // Create the content on the new tree
//         const contentID: number = await contentDAO.create(toTreeID, {
//             content: node.content,
//             type: node.type as ContentType,
//         });

//         /**
//          * Recursive local function to search the tree
//          * for the parent of a give node
//          * @param haystack The node to start searcing from
//          * @param needle The node to find
//          */
//         function search(
//             haystack: GraphNode,
//             needle: GraphNode
//         ): GraphNode | undefined {
//             /* If this node contains the needle we have found our node.
//              * So start propagating it back up. */
//             if (haystack.children.includes(needle)) {
//                 return haystack;
//             } else {
//                 // Declare this here so it doesn't go out of scope
//                 let screenLeft: GraphNode | undefined = undefined;
//                 haystack.children.find((n) => {
//                     // Perform the search on all of this node's children
//                     const localScreenLeft: GraphNode | undefined = search(
//                         n,
//                         needle
//                     );

//                     /* find() expects true if it was found,
//                      * but we are also interested in what was found. */
//                     if (localScreenLeft != undefined)
//                         screenLeft = localScreenLeft;

//                     return localScreenLeft != undefined;
//                 });

//                 // Propagate whatever was found back up to the previous node
//                 return screenLeft;
//             }
//         }

//         // Perform a reverse lookup for the parent starting at the root node
//         const parent = search(graph, node)?.id;

//         // Create the node linking this content to its parent
//         const nodeID: number = await nodeDAO.create({
//             // Use the lookup table to find the corresponding node in the new tree
//             parent: parent == undefined ? undefined : parentCache[parent],
//             content: contentID,
//         });

//         // Create a lookup entry for the old id to the newly generated one
//         parentCache[node.id] = nodeID;

//         // Also copy all of this node's children
//         node.children.forEach(transform);
//     }

//     // Start copying from the root node
//     await transform(graph);

//     // Copy tree metadata
//     const fromTree: Tree = await treeDAO.findByID(fromTreeID);

//     const node: Node = await nodeDAO.findByID(fromTree.rootNode as number);

//     // Update the rootnode of the new tree to new root node
//     await treeDAO.update(toTreeID, {
//         name: fromTree.name,
//         rootNode: parentCache[node.content],
//     });
// };

// export const publish = async (conceptTreeID: number): Promise<void> => {
//     const conceptTree: Tree = await findByID(conceptTreeID);

//     if (!conceptTree.publishedTree) {
//         console.log(conceptTree.creator);
//         const tree: Tree = await create(
//             {
//                 name: conceptTree.name,
//             },
//             (conceptTree.creator as Employee).id
//         );

//         await treeDAO.updatePublishedTree(conceptTree.id, tree.id);

//         conceptTree.publishedTree = tree.id;
//     }

//     await treeDAO.publish(conceptTree.publishedTree);
//     await contentDAO.removeFromTree(conceptTree.publishedTree);

//     if (conceptTree.rootNode)
//         await copy(conceptTreeID, conceptTree.publishedTree);
// };

// export const unpublish = async (conceptTreeID: number): Promise<void> => {
//     const conceptTree: Tree = await findByID(conceptTreeID);
//     await treeDAO.unpublish(conceptTree.publishedTree);
//     await contentDAO.removeFromTree(conceptTree.publishedTree);
// };
