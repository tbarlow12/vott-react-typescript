import React, { ReactSVG } from 'react';
import formSchema from './projectForm.json';
import uiSchema from './projectForm.ui.json';
import Form from 'react-jsonschema-form'
import TagsInput from '../../common/tagsInput'
import { IProject } from '../../../store/applicationState.js';


interface ProjectFormProps extends React.Props<ProjectForm>{
    project: IProject;
    onSubmit: (project: IProject) => void;
    onChange: (project: IProject) => void;
}

interface ProjectFormState {
    formSchema: any;
    uiSchema: any;
    formData: IProject;
}


export default class ProjectForm extends React.Component<ProjectFormProps, ProjectFormState>{
    private widgets = {
        TagsInput: TagsInput
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            formSchema: {...formSchema},
            uiSchema: {...uiSchema},
            formData: this.props.project
        }
    }

    render(){
        return(
            <div className="m-3 text-light">
                <Form
                    widgets={this.widgets}
                    schema={this.state.formSchema}
                    uiSchema={this.state.uiSchema}
                    formData={this.state.formData}
                    onChange={(form) => this.props.onChange(form.formData)}
                    onSubmit={(form) => this.props.onSubmit(form.formData)} >
                </Form>

            </div>
        )
    }
}