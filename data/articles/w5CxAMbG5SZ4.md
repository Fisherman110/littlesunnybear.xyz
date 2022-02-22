# 深度优先搜索，广度优先搜索

### 图像渲染

有一幅以二维整数数组表示的图画，每一个整数表示该图画的像素值大小，数值在 0 到 65535 之间。

给你一个坐标 (sr, sc) 表示图像渲染开始的像素值（行 ，列）和一个新的颜色值 newColor，让你重新上色这幅图像。

为了完成上色工作，从初始坐标开始，记录初始坐标的上下左右四个方向上像素值与初始坐标相同的相连像素点，接着再记录这四个方向上符合条件的像素点与他们对应四个方向上像素值与初始坐标相同的相连像素点，……，重复该过程。将所有有记录的像素点的颜色值改为新的颜色值。

最后返回经过上色渲染后的图像。

示例 1:

输入: 
image = [[1,1,1],[1,1,0],[1,0,1]]
sr = 1, sc = 1, newColor = 2
输出: [[2,2,2],[2,2,0],[2,0,1]]
解析: 
在图像的正中间，(坐标(sr,sc)=(1,1)),
在路径上所有符合条件的像素点的颜色都被更改成2。
注意，右下角的像素没有更改为2，
因为它不是在上下左右四个方向上与初始点相连的像素点。

### 思路：

使用广度优先，层层递归，每一个点都搜索相邻得四个点进行判断，更改颜色。

### 代码：

```c++
class Solution {
public:
    int primitive_color=0;
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {

        primitive_color=image[sr][sc];
        image[sr][sc]=newColor;

        process_point(image,sr,sc,newColor);
        return image;
    }

    void process_point(vector<vector<int>>& image,int sr,int sc,int newColor){

        if( sr>0 && image[sr-1][sc]!=newColor && image[sr-1][sc]==primitive_color){
            image[sr-1][sc]=newColor;
            cout<<sr-1<<" "<<sc<<endl;
            process_point(image,sr-1,sc,newColor);
        }

        if(sr<image.size()-1 && image[sr+1][sc]!=newColor && image[sr+1][sc]==primitive_color){
            image[sr+1][sc]=newColor;
            cout<<sr+1<<" "<<sc<<endl;
            process_point(image,sr+1,sc,newColor);
            
        }

        if(sc>0  && image[sr][sc-1]!=newColor && image[sr][sc-1]==primitive_color){
            image[sr][sc-1]=newColor;
            cout<<sr<<" "<<sc-1<<endl;
            process_point(image,sr,sc-1,newColor);
            
        }

        if(sc< image[0].size()-1 && image[sr][sc+1]!=newColor && image[sr][sc+1]==primitive_color){
            image[sr][sc+1]=newColor;
            cout<<sr<<" "<<sc+1<<endl;
            process_point(image,sr,sc+1,newColor);
            
        }

    }
};
```

### 岛屿的最大面积

给你一个大小为 m x n 的二进制矩阵 grid 。

岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。

岛屿的面积是岛上值为 1 的单元格的数目。

计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。

 

示例 1：

输入：grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]
输出：6
解释：答案不应该是 11 ，因为岛屿只能包含水平或垂直这四个方向上的 1 。

示例 2：

输入：grid = [[0,0,0,0,0,0,0,0]]
输出：0



### 思路：

方法一：深度优先搜索

算法

我们想知道网格中每个连通形状的面积，然后取最大值。

如果我们在一个土地上，以 4个方向探索与之相连的每一个土地（以及与这些土地相连的土地），那么探索过的土地总数将是该连通形状的面积。

为了确保每个土地访问不超过一次，我们每次经过一块土地时，将这块土地的值置为 0。这样我们就不会多次访问同一土地。

### 代码

```c++
class Solution {
    int dfs(vector<vector<int>>& grid, int cur_i, int cur_j) {
        if (cur_i < 0 || cur_j < 0 || cur_i == grid.size() || cur_j == grid[0].size() || grid[cur_i][cur_j] != 1) {
            return 0;
        }
        grid[cur_i][cur_j] = 0;
        int di[4] = {0, 0, 1, -1};
        int dj[4] = {1, -1, 0, 0};
        int ans = 1;
        for (int index = 0; index != 4; ++index) {
            int next_i = cur_i + di[index], next_j = cur_j + dj[index];
            ans += dfs(grid, next_i, next_j);
        }
        return ans;
    }
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int ans = 0;
        for (int i = 0; i != grid.size(); ++i) {
            for (int j = 0; j != grid[0].size(); ++j) {
                ans = max(ans, dfs(grid, i, j));
            }
        }
        return ans;
    }
};


```

### 合并二叉树

给你两棵二叉树： root1 和 root2 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，不为 null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

注意: 合并过程必须从两个树的根节点开始。

示例 1：

输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
输出：[3,4,5,5,4,null,7]

示例 2：

输入：root1 = [1], root2 = [1,2]
输出：[2,2]

### 思路:     

采用深度优先搜索次序进行合并，注意考虑头结点为空的情况，合并过程遇到空节点的情况。注意指针的使用

### 代码：

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* mergeTrees(TreeNode* root1, TreeNode* root2) {
    

        if(root1==NULL && root2!=NULL){
            return root2;
        }else if(root1!=NULL && root2==NULL){
            return root1;
        }else{
            merge(root1,root2);
            return root2;
        }
        

    }

    void merge(TreeNode* root1,TreeNode* root2){

        
        if( root1!=NULL && root2!=NULL){
            root2->val+=root1->val;

            
            if(root1->left!=NULL && root2->left!=NULL) merge(root1->left,root2->left);
            if(root1->right!=NULL && root2->right!=NULL) merge(root1->right,root2->right);

            if(root2->left ==NULL && root1->left!=NULL) {
                root2->left=root1->left;
            }
            
             if(root2->right==NULL && root1->right!=NULL){
                root2->right=root1->right;
            }
            
            //cout<<"world"<<endl;            
        }

    }

```

### 填充每个节点的下一个右侧节点指针

给定一个 完美二叉树 ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：

struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}

填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL。

初始状态下，所有 next 指针都被设置为 NULL。

 

示例 1：

输入：root = [1,2,3,4,5,6,7]
输出：[1,#,2,3,#,4,5,6,7,#]
解释：给定二叉树如图 A 所示，你的函数应该填充它的每个 next 指针，以指向其下一个右侧节点，如图 B 所示。序列化的输出按层序遍历排列，同一层节点由 next 指针连接，'#' 标志着每一层的结束。

示例 2:

输入：root = []
输出：[]

### 思路：

从根节点开始，进行层次遍历，每一层遍历过程中把下一层串成一串。到叶节点直接不做操作结束。一定要熟悉指针的定义和操作。

### 代码：

```c++
/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;

    Node() : val(0), left(NULL), right(NULL), next(NULL) {}

    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}

    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};
*/

class Solution {
public:
    Node* connect(Node* root) {

        if(root==NULL){
            return NULL;
        }

        root->next=NULL;
        //root->left->next=root->right;

        linker(root);
        return root;
        
    }

    void linker(Node *node){

        //非叶节点
        if(node->left!=NULL){
             Node *temp;
             Node *next_turn;

            next_turn=node->left;
             
             while((temp=node->next)!=NULL){

                 node->left->next=node->right;
                 node->right->next=node->next->left;
                 
                 node=temp;
             }
             node->left->next=node->right;
             node->right->next=NULL;

             linker(next_turn);
        }
       
    }
};
```

