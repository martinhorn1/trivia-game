import he from 'he';

function Question(props) {
    return he.decode(props.text);
}

export default Question;