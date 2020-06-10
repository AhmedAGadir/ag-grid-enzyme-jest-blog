import React, { Component } from 'react';

class Paragraph extends Component {
    render() {
        return (
            <p>This is a paragraph</p>
        )
    }
}

function HigherOrderComponent(WrappedComponent) {
    return class extends Component {

        render() {
            return (
                <div>
                    <WrappedComponent />
                </div>
            )
        }
    }
}

const WrappedParagraph = HigherOrderComponent(Paragraph);

export default class extends Component {

    render() {
        return (
            <div>
                <h1>Hello World!</h1>
                <WrappedParagraph />
            </div>
        )
    }
}