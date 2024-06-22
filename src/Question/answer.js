import he from 'he';

function Answer(props) {
    return he.decode(props.answer);
}

export default Answer;