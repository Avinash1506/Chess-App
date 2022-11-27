import { faChessRook as ChessRookBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessRook as ChessRookWhite} from '@fortawesome/free-regular-svg-icons';
import { faChessKnight as ChessKnightBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessKnight as ChessKnightWhite} from '@fortawesome/free-regular-svg-icons';
import { faChessBishop as ChessBishopBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessBishop as ChessBishopWhite} from '@fortawesome/free-regular-svg-icons';
import { faChessQueen as ChessQueenBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessQueen as ChessQueenWhite} from '@fortawesome/free-regular-svg-icons';
import { faChessKing as ChessKingBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessKing as ChessKingWhite} from '@fortawesome/free-regular-svg-icons';
import { faChessPawn as ChessPawnBlack} from '@fortawesome/free-solid-svg-icons';
import { faChessPawn as ChessPawnWhite} from '@fortawesome/free-regular-svg-icons';

export const BoardArray = [
    [{icon: ChessRookBlack, color: 'black', piece: 'rook'}, {icon: ChessKnightBlack, color: 'black', piece: 'knight'}, {icon: ChessBishopBlack, color: 'black', piece: 'bishop'}, {icon: ChessQueenBlack, color: 'black', piece: 'queen'}, {icon: ChessKingBlack, color: 'black', piece: 'king'}, {icon: ChessBishopBlack, color: 'black', piece: 'bishop'}, {icon: ChessKnightBlack, color: 'black', piece: 'knight'}, {icon: ChessRookBlack, color: 'black', piece: 'rook'}],
    [{icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}, {icon: ChessPawnBlack, color: 'black', piece: 'pawn'}],
    [{icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}],
    [{icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}],
    [{icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}],
    [{icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}, {icon: "", color: "", piece: ""}],
    [{icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}, {icon: ChessPawnWhite, color: 'white', piece: 'pawn'}],
    [{icon: ChessRookWhite, color: 'white', piece: 'rook'}, {icon: ChessKnightWhite, color: 'white', piece: 'knight'}, {icon: ChessBishopWhite, color: 'white', piece: 'bishop'}, {icon: ChessQueenWhite, color: 'white', piece: 'queen'}, {icon: ChessKingWhite, color: 'white', piece: 'king'}, {icon: ChessBishopWhite, color: 'white', piece: 'bishop'}, {icon: ChessKnightWhite, color: 'white', piece: 'knight'}, {icon: ChessRookWhite, color: 'white', piece: 'rook'}]
]

export const blackPieces = [ChessPawnBlack, ChessRookBlack, ChessKnightBlack, ChessBishopBlack, ChessQueenBlack, ChessKingBlack];

export const whitePieces = [ChessPawnWhite, ChessRookWhite, ChessKnightWhite, ChessBishopWhite, ChessQueenWhite, ChessKingWhite];
