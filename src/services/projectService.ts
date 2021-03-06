import shortid from 'shortid';
import { IProject } from "../store/applicationState";
import { StorageProviderFactory } from '../providers/storage/storageProvider';

export interface IProjectService {
    get(id: string): Promise<IProject>;
    getList(): Promise<IProject[]>;
    save(project: IProject): Promise<IProject>;
    delete(project: IProject): Promise<void>;
}

export default class ProjectService implements IProjectService {
    get(id: string): Promise<IProject> {
        return new Promise<IProject>(async (resolve, reject) => {
            const allProjects = await this.getList();
            const filtered = allProjects.filter(project => project.id === id);
            if (filtered.length === 1) {
                resolve(filtered[0]);
            }

            reject({
                message: `No project found with id: '${id}'`
            });
        });
    }

    getList(): Promise<IProject[]> {
        return new Promise<IProject[]>((resolve, reject) => {
            const projectsJson = localStorage.getItem('projects');
            if (!projectsJson) {
                return resolve([]);
            }

            let projects: IProject[] = [];

            try {
                projects = JSON.parse(projectsJson);
            }
            catch (err) {
                console.warn('Error loading projects from local storage');
            }

            resolve(projects);
        });
    }

    save(project: IProject) {
        return new Promise<IProject>(async (resolve, reject) => {
            try {
                if (!project.id) {
                    project.id = shortid.generate();
                }

                const storageProvider = StorageProviderFactory.create(project.targetConnection.providerType, project.targetConnection.providerOptions);
                await storageProvider.writeText(`${project.name}.json`, JSON.stringify(project, null, 4));

                let allProjects = await this.getList();
                allProjects = [{ ...project }, ...allProjects.filter(prj => prj.id !== project.id)];
                localStorage.setItem('projects', JSON.stringify(allProjects));
                resolve(project);
            }
            catch (err) {
                reject(err);
            }
        });
    }

    delete(project: IProject) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const storageProvider = StorageProviderFactory.create(project.targetConnection.providerType, project.targetConnection.providerOptions);
                await storageProvider.deleteFile(`${project.name}.json`);

                let allProjects = await this.getList();
                allProjects = allProjects.filter(prj => prj.id !== project.id);
                localStorage.setItem('projects', JSON.stringify(allProjects));
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}