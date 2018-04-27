import { Pagination, IClientSettings } from "ayax-common-types";
import { Inject, Vue } from "vue-property-decorator";
import { TableComponentAction } from '../../../../src/components/table/table-action';

export default abstract class BaseListLayout extends Vue {
    @Inject() clientSettings: IClientSettings;
    pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
    actions = [
        new TableComponentAction({name: "add", title: "Добавить", icon: "mdi-plus", single: false}),
        new TableComponentAction({name: "removeSelected", title: "Удалить выбранные", icon: "delete", single: false, needSelectedItem: true}),
        new TableComponentAction({name: "edit", title: "Редактировать", icon: "mode_edit"}),
        new TableComponentAction({name: "remove", title: "Удалить", icon: "delete"}),
        new TableComponentAction({
            name: "export", 
            title: "Экспорт", 
            icon: "mdi-upload",
            single: false,
            needSelectedItem: true,
            children: [
                new TableComponentAction({name: "Excel", title: "Экспорт в Excel", icon: 'insert_chart', single: false, action: this.exportExcel})
            ]
        })
    ];

    exportExcel() {
        alert("Здесь когда-нибудь будет экспорт в Excel");
    }
}