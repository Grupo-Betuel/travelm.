import createEntityApiSlice from "../entityApiSlice";
import {EntityNames} from "../../models/entitiyModels";
// import {contactApi} from "../../store/store";

const entityName: EntityNames = 'contacts';
const contactsApi = createEntityApiSlice(entityName);

export const useGetContactsQuery = (data?: any) => contactsApi.useFetchAllQuery(data || entityName);
export const {
    useFetchByIdQuery: useGetContactByIdQuery,
    useAddMutation: useAddContactMutation,
    useUpdateMutation: useUpdateContactMutation,
    useDeleteMutation: useDeleteContactMutation,
} = contactsApi as any;
