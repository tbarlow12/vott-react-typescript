import { StorageProviderFactory, IStorageProvider } from './storageProvider';
import { LocalFileSystemProxyOptions, LocalFileSystemProxy } from './localFileSystemProxy';
import { IpcRendererProxy } from '../../common/ipcRendererProxy';

describe('LocalFileSystem Proxy Storage Provider', () => {
    it('Provider is registered with the StorageProviderFactory', () => {
        const storageProvider = StorageProviderFactory.create('localFileSystemProxy');
        expect(storageProvider).not.toBeNull();
    });

    describe('Methods', () => {
        let provider: LocalFileSystemProxy = null;
        let options: LocalFileSystemProxyOptions = {
            folderPath: 'C:\\test'
        };

        beforeEach(() => {
            provider = new LocalFileSystemProxy(options);
        });

        it('selectContainer', async () => {
            const expectedFolderPath = 'C:\\test';
            IpcRendererProxy.send = jest.fn(() => Promise.resolve(expectedFolderPath));

            const actualFolderPath = await provider.selectContainer();
            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:selectContainer');
            expect(actualFolderPath).toEqual(expectedFolderPath);
        });

        it('writeText', async () => {
            IpcRendererProxy.send = jest.fn(() => Promise.resolve());

            const fileName = 'test.txt';
            const contents = 'Hello World!'
            const expectedFilePath = [options.folderPath, fileName].join('\\');
            await provider.writeText(fileName, contents);

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:writeText', [expectedFilePath, contents]);
        });

        it('readText', async () => {
            const expectedContents = 'Hello World!';
            IpcRendererProxy.send = jest.fn(() => Promise.resolve(expectedContents));

            const fileName = 'test.txt';
            const expectedFilePath = [options.folderPath, fileName].join('\\');
            const actual = await provider.readText(fileName);

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:readText', [expectedFilePath]);
            expect(actual).toEqual(expectedContents);
        });

        it('deleteFile', async () => {
            IpcRendererProxy.send = jest.fn(() => Promise.resolve());

            const fileName = 'test.txt';
            const expectedFilePath = [options.folderPath, fileName].join('\\');
            await provider.deleteFile(fileName);

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:deleteFile', [expectedFilePath]);
        });

        it('createContainer', async () => {
            IpcRendererProxy.send = jest.fn(() => Promise.resolve());

            const containerName = 'test';
            const expectedFolderPath = [options.folderPath, containerName].join('\\');
            await provider.createContainer('test');

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:createContainer', [expectedFolderPath]);
        });

        it('deleteContainer', async () => {
            IpcRendererProxy.send = jest.fn(() => Promise.resolve());

            const containerName = 'test';
            const expectedContainerPath = [options.folderPath, containerName].join('\\');
            await provider.deleteContainer(containerName);

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:deleteContainer', [expectedContainerPath]);
        });

        it('listFiles', async () => {
            const expectedFiles = [
                'C:\\test\\file1.txt',
                'C:\\test\\file2.txt',
                'C:\\test\\file3.txt',
                'C:\\test\\file4.txt',
            ];

            IpcRendererProxy.send = jest.fn(() => Promise.resolve(expectedFiles));

            const containerName = 'test';
            const expectedContainerPath = [options.folderPath, containerName].join('\\');
            const actualFiles = await provider.listFiles(containerName);

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:listFiles', [expectedContainerPath]);
            expect(actualFiles).toEqual(expectedFiles);
        });

        it('listContainers', async () => {
            const expectedFolders = [
                'C:\\test\\folder1',
                'C:\\test\\folder2',
                'C:\\test\\folder3',
                'C:\\test\\folder4',
            ];

            IpcRendererProxy.send = jest.fn(() => Promise.resolve(expectedFolders));

            const containerName = 'test';
            const expectedContainerPath = [options.folderPath, containerName].join('\\');
            const actualFolders = await provider.listContainers(containerName);;

            expect(IpcRendererProxy.send).toBeCalledWith('LocalFileSystem:listContainers', [expectedContainerPath]);
            expect(actualFolders).toEqual(expectedFolders);
        });
    });
});