import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default function KeyDetails(props) {
    let {examples} = props;

    // let [examples, setExamples] = useState([]);

    // useEffect(() => {
    //     (async () => {
    //         console.log(`/random/${key}/10`);
    //
    //         setExamples();
    //     })();
    // }, []);

    return (
        <div>
            <ListGroup variant="flush">
                {examples.map((example, i) => (
                    <ListGroupItem key={i} className="pl-3 py-1 bg-light">
                        <span>{example.text}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div>
    );
}