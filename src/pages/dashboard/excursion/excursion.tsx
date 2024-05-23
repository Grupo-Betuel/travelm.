// components/ExcursionsRouter.jsx
import React, {useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import ExcursionsList from "./screens/ExcursionList";
import {ExcursionDetails} from "./screens/ExcursionDetails";
import ExcursionStepper from "./screens/ExcursionStepper";
import {
    useAddContactMutation, useDeleteContactMutation,
    useGetContactByIdQuery,
    useGetContactsQuery, useUpdateContactMutation
} from "../../../api/services/contacts.service";
import {IContact} from "../../../models/contactModel";
import {Button} from "@material-tailwind/react";
import {getCrudService} from "../../../api/services/CRUD.service";


const excursionService = getCrudService("excursions");
function Excursions() {
    // const {data: contacts, isLoading, isError} = useGetContactsQuery()
    // const {data: contact, isError: contactError, isLoading: isContactLoading} = useGetContactByIdQuery("663f971e9edd3190bf44ee96");
    // const [addContact, {isLoading: isAddContactLoading, data: newContact}] = useAddContactMutation();
    // const [updateContact] = useUpdateContactMutation();
    // const [deleteContact, {isLoading: isDeleting, data: deletedContact }] = useDeleteContactMutation();
    // const handleContact = async () => {
    //     await addContact({
    //         // location: {} as any,
    //         tel: "18094055531",
    //         phone: "18094055531",
    //         email: "wilfre_padillaPaulino",
    //     })
    // }
    // const handleDeleteContact = async () => {
    //     await deleteContact("663f9a599edd3190bf44eeb5")
    // }

    // const {data: excursions, isLoading: isExcursionsLoading, isError: isExcursionsError} = excursionService.useFetchAllExcursions('')

    // console.log("excursions", excursions)



    useEffect(() => {
        // getContactById(1);

    }, [])

    // return <div>hola</div>


    return (
        <div className="pt-5">
            {/*<Button onClick={handleContact}>Add Contact</Button>*/}
            {/*<Button onClick={handleDeleteContact}>Delete Contact</Button>*/}

            <Routes>
                <Route index element={<ExcursionsList/>}/>
                <Route path="/:excursionId" element={<ExcursionDetails/>}/>
                <Route path="/handler" element={<ExcursionStepper/>}/>
                <Route path="/handler/:excursionId" element={<ExcursionStepper/>}/>
                {/*<Route path="organization/:organizationId" element={<OrganizationDetail />} />*/}
            </Routes>
        </div>
    );
}

export default Excursions;
