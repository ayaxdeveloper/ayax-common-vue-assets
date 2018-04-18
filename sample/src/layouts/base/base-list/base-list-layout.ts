import { Pagination, IClientSettings } from "ayax-common-types";
import { Inject, Vue } from "vue-property-decorator";
import { TableComponentAction } from '../../../components/table/table-action';

export default abstract class BaseListLayout extends Vue {
    @Inject() clientSettings: IClientSettings;
    pagination = Pagination.Default(this.clientSettings.listRowsPerpage);
    actions = [
        new TableComponentAction({name: "edit", title: "Редактировать", icon: "mode_edit"}),
        new TableComponentAction({name: "remove", title: "Удалить", icon: "delete"})
    ];
}