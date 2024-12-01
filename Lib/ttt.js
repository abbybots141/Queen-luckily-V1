const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

// Initialize game state
const games = {};

// Generate an empty Tic Tac Toe board
function createEmptyBoard() {
    return [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"],
    ];
}

// Convert the board to a string for display
function renderBoard(board) {
    return board.map(row => row.join(" ")).join("\n");
}

// Check for a winner
function checkWinner(board) {
    const lines = [
        // Rows
        [ [0, 0], [0, 1], [0, 2] ],
        [ [1, 0], [1, 1], [1, 2] ],
        [ [2, 0], [2, 1], [2, 2] ],
        // Columns
        [ [0, 0], [1, 0], [2, 0] ],
        [ [0, 1], [1, 1], [2, 1] ],
        [ [0, 2], [1, 2], [2, 2] ],
        // Diagonals
        [ [0, 0], [1, 1], [2, 2] ],
        [ [0, 2], [1, 1], [2, 0] ],
    ];
    for (const line of lines) {
        const [a, b, c] = line;
        if (
            board[a[0]][a[1]] !== "-" &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]
        ) {
            return board[a[0]][a[1]];
        }
    }
    return null;
}

// Handle player moves
function makeMove(board, row, col, player) {
    if (board[row][col] === "-") {
        board[row][col] = player;
        return true;
    }
    return false;
}

// Main WhatsApp bot logic
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text.toLowerCase() === "start tictactoe") {
            // Initialize game
            games[from] = {
                board: createEmptyBoard(),
                currentPlayer: "X",
            };
            await sock.sendMessage(from, { text: `Tic Tac Toe started!\n\n${renderBoard(games[from].board)}\n\nPlayer X's turn.` });
        } else if (text.toLowerCase().startsWith("move")) {
            // Parse move command
            const [_, row, col] = text.split(" ");
            if (!games[from]) {
                await sock.sendMessage(from, { text: "No game in progress. Type 'start tictactoe' to start." });
                return;
            }

            const game = games[from];
            if (!makeMove(game.board, parseInt(row), parseInt(col), game.currentPlayer)) {
                await sock.sendMessage(from, { text: "Invalid move! Try again." });
                return;
            }

            // Check for winner or next move
            const winner = checkWinner(game.board);
            if (winner) {
                await sock.sendMessage(from, { text: `Player ${winner} wins!\n\n${renderBoard(game.board)}` });
                delete games[from];
            } else if (game.board.flat().every(cell => cell !== "-")) {
                await sock.sendMessage(from, { text: `It's a draw!\n\n${renderBoard(game.board)}` });
                delete games[from];
            } else {
                // Switch player
                game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
                await sock.sendMessage(from, { text: `${renderBoard(game.board)}\n\nPlayer ${game.currentPlayer}'s turn.` });
            }
        }
    });
}

startBot().catch(console.error);