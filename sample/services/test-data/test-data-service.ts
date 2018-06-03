import Vue from "vue";

export default class TestDataService extends Vue {
    data = [
        { id: 1, code: '1231', title: 'Alpha', created: new Date('2018-04-01'), dictionaryId: 0},
        { id: 2, code: '1232', title: 'Bravo', created: new Date('2018-04-02'), dictionaryId: 1},
        { id: 3, code: '1233', title: 'Charlie', created: new Date('2018-04-03'), dictionaryId: 2},
        { id: 4, code: '1234', title: 'Delta', created: new Date('2018-04-04'), dictionaryId: 1},
        { id: 5, code: '1235', title: 'Echo', created: new Date('2018-04-05'), dictionaryId: 0},
        { id: 6, code: '1236', title: 'Foxtrot', created: new Date('2018-04-06'), dictionaryId: 0},
        { id: 7, code: '1237', title: 'Golf', created: new Date('2018-04-07'), dictionaryId: 0},
        { id: 8, code: '1238', title: 'Hotel', created: new Date('2018-04-08'), dictionaryId: 0},
        { id: 9, code: '1239', title: 'India', created: new Date('2018-04-09'), dictionaryId: 0},
        { id: 10, code: '12310', title: 'Juliett', created: new Date('2018-04-10'), dictionaryId: 1}
    ];

    lastId = 10;

    getPage(page, perPage) {
        page = page - 1
        return this.getData().slice(page * perPage, (page + 1) * perPage)
    }

    getData() {
        return this.data;
    }

    getDictionary() {
        return [
            {id: 0, title: "Не указана", order: 0, isActive: true},
            {id: 1, title: "Значение 1", order: 1, isActive: true},
            {id: 2, title: "Значение 2", order: 2, isActive: true}
        ];
    }

    getById(id:number) {
        for(var i = 0; i < this.getData().length; i++) {
            if(this.getData()[i].id == id){
                return this.getData()[i]
            }
        }
        return null;
    }

    add(item) {
        let row = { id: this.lastId + 1, code: item.code, title: item.title, created: item.created, dictionaryId: 0 };
        this.getData().push(row);
        this.lastId++;
    }

    edit(id, item) {
        for(var i = 0; i < this.getData().length; i++) {
            if(this.getData()[i].id == id){
                this.getData()[i].code = item.code;
                this.getData()[i].title = item.title;
                this.getData()[i].created = item.created;
            }
        }
    }

    remove(id) {
        for(var i = 0; i < this.getData().length; i++) {
            if(this.getData()[i].id == id){
                this.getData().splice(i, 1);
            }
        }
    }

    bulkDelete(items) {
        items.forEach(element => {
            this.remove(element.id)
        });
    }

    sortData(data, isdesc: boolean) {
        if(!isdesc) {
            return data.sort(function(a,b){
                var x = a.title.toLowerCase();
                var y = b.title.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            })
        } else {
            return data.sort(function(a,b){
                var x = a.title.toLowerCase();
                var y = b.title.toLowerCase();
                if (x > y) {return -1;}
                if (x < y) {return 1;}
                return 0;
            })
        }
    }

    filterByTitle(title) {
        return this.getData().filter(el => el.title.toLowerCase().includes(title))
    }
}