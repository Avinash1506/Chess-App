import "./Card.css";

const Card = (props) => {
    return (
        <div className={props.hover ? 'cardHover' : 'card' } style={{height: props.height, padding: props.padding, margin: props.margin}}>
            {props.children}
        </div>
    )
}

export default Card;