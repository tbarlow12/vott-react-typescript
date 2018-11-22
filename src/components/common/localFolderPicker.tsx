import React from 'react';
import LocalFileSystemProxy from '../../providers/storage/localFileSystem';

interface LocalFolderPickerProps {
    id: string;
    value: any;
    onChange: (value) => void;
}

interface LocalFolderPickerState {
    value: any
}

export default class LocalFolderPicker extends React.Component<LocalFolderPickerProps, LocalFolderPickerState> {
    private localFileSystem: LocalFileSystemProxy;

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: this.props.value
        };

        this.localFileSystem = new LocalFileSystemProxy();
        this.selectLocalFolder = this.selectLocalFolder.bind(this);
    }

    selectLocalFolder = async () => {
        const filePath = await this.localFileSystem.selectContainer();
        if (filePath) {
            this.setState({
                value: filePath
            }, () => this.props.onChange(filePath));
        }
    }

    render() {
        const { id } = this.props;
        const { value } = this.state;

        return (
            <div className="input-group">
                <input id={id} type="text" className="form-control" value={value} readOnly />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={this.selectLocalFolder}>Select Folder</button>
                </div>
            </div>
        );
    }
}