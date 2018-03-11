module.exports = function solveSudoku(matrix) {

    let allBlocks = function () {
        let result = [];
        for (let i = 0; i < 9; i++) {
            let rb = {};
            rb.start = [i, 0];
            rb.end = [i, 8];
            rb.btype = 'R';
            result.push(rb);
            let cb = {};
            cb.start = [0, i];
            cb.end = [8, i];
            cb.btype = 'C';
            result.push(cb);
            let bb = {};
            bb.start = [(i - i % 3), (i % 3) * 3];
            bb.end = [bb.start[0] + 2, bb.start[1] + 2];
            bb.btype = 'B';
            result.push(bb);
        }
        return result;
    };

    let doesBlockContainPoint = function (ri, ci, block) {
        switch (block.btype) {
            case 'B':
                return ri >= block.start[0] && ri <= block.end[0] && ci >= block.start[1] && ci <= block.end[1];
            case 'R':
                return ri === block.start[0];
            case 'C':
                return ci === block.start[1];
        }
    };

    let getAllZeros = function (matrix, block) {
        //get All points with value 0;
        let r = [];
        switch (block.btype) {
            case 'B':
                for (let ri = block.start[0]; ri <= block.end[0]; ri++) {
                    for (let ci = block.start[1]; ci <= block.end[1]; ci++) {
                        if (matrix[ri][ci] === 0) {
                            r.push([ri, ci]);
                        }
                    }
                }
                break;
            case 'C':
                for (let i = 0; i < 9; i++) {
                    if (matrix[i][block.start[1]] === 0) {
                        r.push([i, block.start[1]]);
                    }
                }
                break;
            case 'R':
                for (let i = 0; i < 9; i++) {
                    if (matrix[block.start[0]][i] === 0) {
                        r.push([block.start[0], i]);
                    }
                }
                break;
        }
        return r;
    };

    let countEmptyValues = function (matrix, block) {
        return getAllZeros(matrix, block).length;
    };

    let getFilledValues = function (matrix, block) {
        let r = [];
        switch (block.btype) {
            case 'B':
                for (let ri = block.start[0]; ri <= block.end[0]; ri++) {
                    for (let ci = block.start[1]; ci <= block.end[1]; ci++) {
                        if (matrix[ri][ci] !== 0) {
                            r.push(matrix[ri][ci]);
                        }
                    }
                }
                break;
            case 'C':
                for (let i = 0; i < 9; i++) {
                    if (matrix[i][block.start[1]] !== 0) {
                        r.push(matrix[i][block.start[1]]);
                    }
                }
                break;
            case 'R':
                for (let i = 0; i < 9; i++) {
                    if (matrix[block.start[0]][i] !== 0) {
                        r.push(matrix[block.start[0]][i]);
                    }
                }
                break;
        }
        return r;
    };

    let getPossibleValues = function (ri, ci, matrix, blocks) {
        let filled = new Set();
        let zb = blocks.filter((b) => doesBlockContainPoint(ri, ci, b));
        zb.forEach((b) => {
            let f = getFilledValues(matrix, b);
            f.forEach((v) => {
                if (!filled.has(v)) filled.add(v)
            });
        });
        let possibilities = [];
        for (let i = 1; i < 10; i++) {
            if (!filled.has(i)) possibilities.push(i);
        }
        return possibilities;
    };
    let tryToSolve = function (matrix, blocks) {
        //Find the blocks with zeros;
        let zeroContainingBlocks = blocks.filter((b) => countEmptyValues(matrix, b) > 0);
        if (zeroContainingBlocks.length === 0) return true;
        zeroContainingBlocks.sort((b1, b2) => countEmptyValues(matrix, b1) - countEmptyValues(matrix, b2));
        let wb = zeroContainingBlocks[0];
        let zeroPoints = getAllZeros(matrix, wb);
        zeroPoints.sort((p1, p2) => getPossibleValues(p1[0], p1[1], matrix, blocks).length - getPossibleValues(p2[0], p2[1], matrix, blocks).length);
        let wp = zeroPoints[0];
        let wpPossibilities = getPossibleValues(wp[0], wp[1], matrix, blocks);
        if (wpPossibilities.length === 0) return false;
        let index = 0;
        let isSolved = false;
        while (!isSolved && index < wpPossibilities.length) {
            matrix[wp[0]][wp[1]] = wpPossibilities[index++];
            isSolved = tryToSolve(matrix, blocks);
        }
        if (!isSolved) {
            matrix[wp[0]][wp[1]] = 0;
        }
        return isSolved;
    };

    tryToSolve(matrix, allBlocks());
    return matrix;
};