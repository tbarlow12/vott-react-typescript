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
import { debug } from 'util';

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
        <div className={props.className}>
        {props.items &&
          props.items.map(element => (
            <div key={element.index}>
              <div>{element.children}</div>
              {element.hasMoveDown && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}>
                  Down
                </button>
              )}
              {element.hasMoveUp && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}>
                  Up
                </button>
              )}
              <button onClick={element.onDropIndexClick(element.index)}>
                Delete
              </button>
              <hr />
            </div>
          ))}
  
        {props.canAdd && (
          <div className="row">
            <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
              <div onClick={props.onAddClick} className="button big-btn">Add Tag</div>
            </p>
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
        debugger;
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
