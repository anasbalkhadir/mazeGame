// Adapted implementation of BFS Single-source shortest paths to  find a shortest path
// https://hezhigang.github.io/2020/01/30/shortest-path-in-a-binary-maze/ 


function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Node(pt, dist) {
    this.pt = pt;
    this.dist = dist;
}

var d = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 }
];

//return the shortest path given binary maze and the src and dest
export function bfs(maze, source, destination) {
    var src = new Point(source[0], source[1]);
    var dest = new Point(destination[0], destination[1]);
    var minDist = -1;
    if (maze[src.x][src.y] != 1 || maze[dest.x][dest.y] != 1)
        return minDist;
    var h = maze.length;
    var w = maze[0].length;
    var visited = [];
    for (var i = 0; i < h; i++) {
        visited.push([]);
        for (var j = 0; j < w; j++) {
            visited[i].push(false);
        }
    }
    var queue = [];
    var s = new Node(src, 0);
    queue.push(s);

    while (queue.length > 0) {
        var curr = queue.pop();
        var pt = curr.pt;
        if (pt.x == dest.x && pt.y == dest.y)
            return curr.dist;
        for (var i = 0; i < 4; i++) {
            var row = pt.x + d[i].x;
            var col = pt.y + d[i].y;
            if (isValid(maze, visited, h, w, row, col)) {
                visited[row][col] = true;
                var adjCell = new Node(new Point(row, col), curr.dist + 1);
                queue.push(adjCell);
            }
        }
    }
    return minDist;
}

function isValid(maze, visited, width, height, row, col) {
    return (row >= 0) && (row < width) && (col >= 0) && (col < height) && maze[row][col] == 1 && !visited[row][col];
}
