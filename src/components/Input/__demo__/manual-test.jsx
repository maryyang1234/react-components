import React from 'react';

import Button from 'src/components/Button';
import { components } from '../../../../index';

const { Input } = components;
class InputDemo extends React.Component {
    testRef() {
        console.log(this.input2, this.input2.input, this.input2.focus);
        this.input2.focus();
    }
    render() {
        return (
            <div>
                <h2>应当被容器压缩</h2>
                <div style={{ width: '40px', border: '1px solid red' }}>
                    <Input />
                </div>
                <h2>ref 测试</h2>
                <div className="demo-wrap">
                    <Input ref={_ref => (this.input2 = _ref)} />
                    <Button onClick={() => this.testRef()}>check</Button>
                </div>
                <h2>禁用状态下 clear 测试</h2>
                <div className="demo-wrap">
                    <Input clearable disabled defaultValue="default" />
                </div>
            </div>
        );
    }
}
class SearchDemo extends React.Component {
    testRef() {
        console.log(this.input2, this.input2.input, this.input2.focus);
        this.input2.focus();
    }
    render() {
        return (
            <div>
                <h2>应当被容器压缩</h2>
                <div style={{ width: '40px', border: '1px solid red' }}>
                    <Input.Search />
                </div>
                <h2>ref 测试</h2>
                <div className="demo-wrap">
                    <Input.Search ref={_ref => (this.input2 = _ref)} />
                    <Button onClick={() => this.testRef()}>check</Button>
                </div>
            </div>
        );
    }
}
const Demo = () => (
    <>
        <InputDemo />
        <SearchDemo />
    </>
);
// demo end

export default Demo;
