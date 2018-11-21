import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IProjectActions, * as projectActions from '../../../actions/projectActions';
import ApplicationState, { IProject } from '../../../store/applicationState';
import Form from 'react-jsonschema-form'
import formSchema from './schema.json';
import uiSchema from './uiSchema.json'
import '../../../assets/sass/theme.scss'
import './projectSettingsPage.scss'
import {getRandomColor} from '../../../common/utils'
import { debug } from 'util';
import { RouteComponentProps } from 'react-router-dom';

interface ProjectSettingsPageProps extends RouteComponentProps, React.Props<ProjectSettingsPage> {
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
        <div className={props.className}>
        {props.items && props.items.map(element => (
            <div key={element.index}>
                <table className="center">
                    <tr>
                        <td>
                            <button disabled={element.hasMoveDown === false}
                            onClick={element.onReorderClick(
                                element.index,
                                element.index + 1
                            )}>Down</button>
                        </td>
                        <td>
                            <div className="button delete-btn" onClick={element.onDropIndexClick(element.index)}>Remove Tag</div>
                        </td>
                        <td>
                            <button disabled={element.hasMoveUp === false}
                            onClick={element.onReorderClick(
                                element.index,
                                element.index - 1
                            )}>Up</button>
                        </td>
                    </tr>
                </table>
                    

                    
              <div>{element.children}</div>
              
              <hr />
            </div>
          ))}
  
        {props.canAdd && (
          <div className="row">
              <div onClick={props.onAddClick} className="button add-btn">Add Tag</div>
          </div>
        )}
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
            this.props.actions.saveProject(this.state.project)
                .then(project => {
                    this.props.history.push(`/projects/${project.id}/edit`);
                });
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
