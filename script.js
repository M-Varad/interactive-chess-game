import { Chess } from "./chess.js";

const chess = new Chess();

function getSquareId(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // Columns (files)
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']; // Rows (ranks)
    return files[col] + ranks[row];
}

function getPieceImage(piece) {
    const color = piece.color === 'w' ? 'W' : 'B';
    const type = piece.type;
    return `images/${color}${type}.png`;
}

function updateBoard() {
    const boardState = chess.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = boardState[row][col];
            const squareId = getSquareId(row, col);
            const cell = document.getElementById(squareId);

            cell.innerHTML = "";

            if (piece) {
                const img = document.createElement('img');
                img.src = getPieceImage(piece);
                img.id = `${piece.color}${piece.type}`;
                cell.appendChild(img);
            }
        }
    }
}

let selectedSquare = null;
document.querySelectorAll("#chessboard th").forEach(cell => {
    cell.onclick = () => {
        if (selectedSquare) {
            const from = selectedSquare.id;
            const to = cell.id;
            const move = chess.move({ from, to, promotion: 'q' });

            if (move) {
                updateBoard();
            } else {
                console.error("Invalid move");
            }

            selectedSquare = null;
        } else if (cell.querySelector('img')) {
            selectedSquare = cell;
        }
    };
});

document.querySelectorAll("#chessboard th").forEach(cell => {
    cell.onclick = () => {
        if (selectedSquare) {
            const from = selectedSquare.id;
            const to = cell.id;
            
            // Your fix from before: Always promote to Queen
            const move = chess.move({ from, to, promotion: 'q' });

            if (move) {
                updateBoard(); // Update the UI first
                
                // --- NEW CODE STARTS HERE ---
                // We use setTimeout to let the browser draw the last move 
                // BEFORE the alert freezes the screen.
                if (chess.game_over()) {
                    setTimeout(() => {
                        if (chess.in_checkmate()) {
                            alert("Game Over: Checkmate! " + (chess.turn() === 'w' ? "Black" : "White") + " wins.");
                        } else if (chess.in_draw()) {
                            alert("Game Over: Draw!");
                        } else if (chess.in_stalemate()) {
                            alert("Game Over: Stalemate!");
                        } else {
                            alert("Game Over!");
                        }
                    }, 100); 
                }
                // --- NEW CODE ENDS HERE ---

            } else {
                console.error("Invalid move");
                // Optional: visual feedback for invalid move
                selectedSquare.style.backgroundColor = ""; 
            }

            // Clear selection visual (if you added any highlighting)
            selectedSquare = null;
            
        } else if (cell.querySelector('img')) {
            selectedSquare = cell;
            // Optional: Add a highlight to show which piece is selected
            // cell.style.backgroundColor = "yellow"; 
        }
    };
});
updateBoard();
