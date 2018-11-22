import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IProjectActions, * as projectActions from '../../../actions/projectActions';
import ApplicationState, { IProject } from '../../../store/applicationState';
import Form from 'react-jsonschema-form'
import { RouteComponentProps } from 'react-router-dom';
import TagsInput from '../../common/tagsInput'
import ProjectForm from './projectForm'

interface ProjectSettingsPageProps extends RouteComponentProps, React.Props<ProjectSettingsPage> {
    currentProject: IProject;
    actions: IProjectActions;
}

interface ProjectSettingsPageState {
    project: IProject;
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

@connect(mapStateToProps, mapDispatchToProps)
export default class ProjectSettingsPage extends React.Component<ProjectSettingsPageProps, ProjectSettingsPageState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            project: this.props.currentProject,
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit = (form) => {
        this.setState({
            project: form.formData
        }, () => {
            this.props.actions.saveProject(this.state.project)
                .then(project => {
                    this.props.history.push(`/projects/${project.id}/edit`);
                });
        });
    }

    onFormChange = (form) => {
    }

    render() {
        return (
            <div className="m-3 text-light">
                <h3><i className="fas fa-sliders-h fa-1x"></i><span className="px-2">Project Settings</span></h3>
                <hr />
                <ProjectForm
                    project={this.state.project}
                    onSubmit={this.onFormSubmit}
                    onChange={this.onFormChange}/>
            </div>
        );
    }
}
