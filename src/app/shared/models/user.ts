export class User {
    readonly id: string|null; // id de l’utilisateur qui peut être une chaîne ou "null".
    email: string; // email de l’utilisateur
    name: string; // nom de l’utilisateur
    avatar: string; // url vers la photo de profil de l’utilisateur
    pomodoroDuration: number; // durée des pomodoros
     
    constructor(options: {
     id?: string,
     email?: string,
     name?: string,
     avatar?: string,
     pomodoroDuration?: number,
    } = {}) {
     this.id = options.id || null;
     this.email = options.email || '';
     this.name= options.name || '';
     this.avatar = options.avatar || '';
     this.pomodoroDuration = options.pomodoroDuration || 1500;
    }
    
    get roles(): string[] {
     return this.email.endsWith('google.com') ? ['USER', 'EMPLOYEE'] : ['USER'];
    }

    hasRole(role: string): boolean {
        return this.roles.includes(role);
    }
}
