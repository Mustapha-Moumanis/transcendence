
export default class Player {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
    }

    nameGetter() {
        return this.name;    
    }

    avatarGetter() {
        return this.avatar;
    }

    avatarSetter(avatar) {
        this.avatar = avatar;
    }
}