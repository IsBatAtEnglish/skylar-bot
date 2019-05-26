import { readFileSync } from "fs";

class Settings {
    public file_path: string;
    private file_contents: string;
    private data: any;

    constructor (file: string) {
        this.file_path = file;
        this.reload()
    }

    /**
     * reload
     * @description Lê novamente o arquivo de configuração.
     */
    public reload() {
        this.file_contents = readFileSync(this.file_path, { encoding: 'utf-8' });
        this.data = JSON.parse(this.file_contents);
    }

    /**
     * get
     * @description Retorna um valor de configuração.
     */
    public value(key: string): string {
        return this.data[key].toString();
    }
}
export default Settings