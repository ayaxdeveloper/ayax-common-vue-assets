import Vue from "vue";

export default class TestDataService extends Vue {
    data = [
        { id: 1, code: '1231', title: 'Alpha', created: new Date('2018-04-01')},
        { id: 2, code: '1232', title: 'Bravo', created: new Date('2018-04-02')},
        { id: 3, code: '1233', title: 'Charlie', created: new Date('2018-04-03')},
        { id: 4, code: '1234', title: 'Delta', created: new Date('2018-04-04')},
        { id: 5, code: '1235', title: 'Echo', created: new Date('2018-04-05')},
        { id: 6, code: '1236', title: 'Foxtrot', created: new Date('2018-04-06')},
        { id: 7, code: '1237', title: 'Golf', created: new Date('2018-04-07')},
        { id: 8, code: '1238', title: 'Hotel', created: new Date('2018-04-08')},
        { id: 9, code: '1239', title: 'India', created: new Date('2018-04-09')},
        { id: 10, code: '12310', title: 'Juliett', created: new Date('2018-04-10')}
    ];

    lastId = 10;

    getPage(page, perPage) {
        page = page - 1
        return this.getData().slice(page * perPage, (page + 1) * perPage)
    }

    getData() {
        return this.data;
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
        let row = { id: this.lastId + 1, code: item.code, title: item.title, created: item.created };
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