export class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Add methods for user-specific logic if needed
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}
