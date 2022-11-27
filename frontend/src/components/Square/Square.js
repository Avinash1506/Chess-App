import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Square.css";


const Square = (props) => {
    const { row, col, squareColor, piecePresent, pieceType, pieceColor, pieceName, highlight } = props;
    const cls = "square row"+row+" col"+col;
    return (
        <>
            <div 
                className = {cls} 
                style = { 
                    {
                        backgroundColor: squareColor
                    }
                }
            >
                {highlight === 'yes' && <span className="ele1"></span>}
                {/* style={{transform: props.colorOfUser === 'black' ? "rotate(180deg)" : ''}} */}
                <div className="ele2" style={{transform: props.colorOfUser === 'black' ? "rotate(180deg)" : ''}}>
                    {piecePresent !== false && <FontAwesomeIcon icon={pieceType} size="2x" className="w-100"/>}
                </div>
                
            </div>  
        </>
    )
}

export default Square;