import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IProjectActions, * as projectActions from '../../../actions/projectActions';
import ApplicationState, { IProject } from '../../../store/applicationState';
import Form from 'react-jsonschema-form'
import formSchema from './schema.json';
import uiSchema from './uiSchema.json'
import './projectSettingsPage.scss'
import {getRandomColor} from '../../../common/utils'

interface ProjectSettingsPageProps {
    currentProject: IProject;
    actions: IProjectActions;
}

interface ProjectSettingsPageState {
    project: IProject;
    formSchema: any;
}

function mapStateToProps(state: ApplicationState) {
    return {
        currentProject: state.currentProject
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(projectActions, dispatch)
    };
}

function ArrayFieldTemplate(props) {
    return (
      <div>
        {props.items.map(element => element.children)}
        {props.canAdd && <div className="button big-btn" onClick={props.onAddClick}>Add Tag</div>}
      </div>
    );
  }
  

@connect(mapStateToProps, mapDispatchToProps)
export default class ProjectSettingsPage extends React.Component<ProjectSettingsPageProps, ProjectSettingsPageState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            formSchema: { ...formSchema },
            project: this.props.currentProject
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit = (form) => {
        this.setState({
            project: form.formData
        }, () => {
            this.props.actions.saveProject(this.state.project);
        });
    }

    render() {
        return (
            <div className="m-3 text-light">
                <h3><i className="fas fa-sliders-h fa-1x"></i><span className="px-2">Project Settings</span></h3>
                <hr />

                <Form
                    schema={this.state.formSchema}
                    uiSchema={uiSchema}
                    formData={this.state.project}
                    ArrayFieldTemplate={ArrayFieldTemplate}
                    onSubmit={this.onFormSubmit} />
            </div>
        );
    }
}
