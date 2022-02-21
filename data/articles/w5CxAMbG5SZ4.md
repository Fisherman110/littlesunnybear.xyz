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

