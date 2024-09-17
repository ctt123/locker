import {useEffect, useState} from "react";
import boxesData from '../assets/box.json';

const initialState = boxesData.boxes.map((box, index) => ({
    ...box,
    id: `box-${index}`,
}));
const DraggableBoxes = () => {
    const [data, setData] = useState(initialState)
    const boxStatus =new Map([
        ['配備待ち', { backgroundColor: 'white', color: 'black' }],
        ['検証進捗 1/7', { backgroundColor: '#f9ae3c', color: 'white' }],
        ['完了', { backgroundColor: '#1bb883', color: 'white' }],
    ])
    useEffect(() => {

        const draggables = document.querySelectorAll(".draggable");
        const containers = document.querySelectorAll(".container");

        draggables.forEach((draggable) => {
            draggable.addEventListener("dragstart", () => {
                draggable.classList.add("dragging");
            });
            draggable.addEventListener("touchstart", () => {
                draggable.classList.add("dragging");
            });

            draggable.addEventListener("dragend", () => {
                draggable.classList.remove("dragging");
                const draggedElements = document.querySelectorAll(".draggable")
                const newData = [...draggedElements].map((item) => {
                    return data.find(it => it.id === item.getAttribute('data-id'))
                })
                newData || setData(newData)
            });


            draggable.addEventListener("touchend", () => {
                draggable.classList.remove("dragging");
                const draggedElements = document.querySelectorAll(".draggable")
                const newData = [...draggedElements].map((item) => {
                    return data.find(it => it.id === item.getAttribute('data-id'))
                })
                newData || setData(newData)
            });

        });


        containers.forEach((container) => {
            container.addEventListener("dragover", (eve ) => {
                const e= eve as DragEvent
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
                const draggable = document.querySelector(".dragging");
                if(!draggable) return
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });
        });
        containers.forEach((container) => {
            container.addEventListener("touchmove", (eve: Event) => {
                eve.preventDefault();
                const e = (eve as TouchEvent).targetTouches[0]
                const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
                const draggable = document.querySelector(".dragging");
                if(!draggable) return
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });
        });

        function getDragAfterElement(container:Element, x:number, y:number) {
            const draggableElements = [
                ...container.querySelectorAll(".draggable:not(.dragging)")
            ];
            return draggableElements.reduce(
                (closest, child, index) => {
                    const box = child.getBoundingClientRect();
                    const nextBox = draggableElements[index + 1] && draggableElements[index + 1].getBoundingClientRect();
                    const inRow = y - box.bottom <= 0 && y - box.top >= 0;
                    const offset = x - (box.left + box.width / 2);
                    if (inRow) {
                        if (offset < 0 && offset > closest.offset) {
                            return {
                                offset: offset,
                                element: child
                            };
                        } else {
                            if (
                                nextBox &&
                                y - nextBox.top <= 0 &&
                                closest.offset === Number.NEGATIVE_INFINITY
                            ) {
                                return {
                                    offset: 0,
                                    element: draggableElements[index + 1]
                                };
                            }
                            return closest;
                        }
                    } else {
                        return closest;
                    }
                }, {
                    offset: Number.NEGATIVE_INFINITY
                }
            ).element;
        }
    }, [])

    return (

        <div className="container">
            {
                data.map((item) => {


                    return (
                        <div className="draggable" draggable="true" key={item.id} data-id={item.id}
                               style={{
                                   height: item.size == 'M' ? '12em' : '24em',
                                   gridRowEnd: 'span ' + (item.size === 'M' ? '126' : '246')
                               }}
                    ><div className={'content'}>
                            <div>
                                {item.number}
                            </div>
                            <div className='status' style={{backgroundColor:boxStatus.get(item.status)?.backgroundColor,color:boxStatus.get(item.status)?.color}}>{item.status}</div>
                        </div>
                        </div>
                    )
                })
            }
        </div>
    );
}
export default DraggableBoxes;
