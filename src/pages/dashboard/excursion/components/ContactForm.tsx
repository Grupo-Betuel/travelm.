import React, {useState} from "react";
import {Button, Input, Typography} from "@material-tailwind/react";
import {IContact} from "@/models/contactModel";

interface ContactFormProps {
    contact: IContact;
    updateContact: (contact: IContact) => void;
}

const emptyContact: IContact = {
    tel: '',
    phone: '',
    email: '',
};

const ContactForm: React.FC<ContactFormProps> = ({contact, updateContact}) => {
    const [contactForm, setContactForm] = useState<IContact>(contact || emptyContact);
    const [editMode, setEditMode] = useState<boolean>(false);

    // Función para limpiar el formulario
    const cleanContactHandler = () => {
        setContactForm(emptyContact);
        setEditMode(false);
    };

    // Agregar o actualizar contacto
    const handleAddOrUpdateContact = () => {
        updateContact(contactForm);
        cleanContactHandler();
    };

    // Cambiar los valores del contacto
    const handleOnChangeContact = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        setContactForm({...contactForm, [name]: value});
    };

    // Activar el modo edición
    const activateEditMode = () => {
        setEditMode(true);
    };

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-1 gap-4">
                <Input
                    crossOrigin={false}
                    label="Email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleOnChangeContact}
                    className="col-span-2"
                />
                <div className='grid grid-cols-2 gap-4 '>

                <Input
                    crossOrigin={false}
                    label="Phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleOnChangeContact}
                    className="col-span-2 md:col-span-1"
                />
                <Input
                    crossOrigin={false}
                    label="Telephone"
                    name="tel"
                    value={contactForm.tel}
                    onChange={handleOnChangeContact}
                    className="col-span-2 md:col-span-1"
                />
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
