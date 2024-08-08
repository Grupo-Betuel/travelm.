import React from "react";
import { Input } from "@material-tailwind/react";
import { IContact } from "@/models/contactModel";

interface ContactFormProps {
    contact: IContact;
    updateContact: (contact: IContact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, updateContact }) => {
    const handleOnChangeContact = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        updateContact({ ...contact, [name]: value });
    };

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-1 gap-4">
                <Input
                    // crossOrigin={false}
                    label="Email"
                    name="email"
                    value={contact.email}
                    onChange={handleOnChangeContact}
                    className="col-span-2"
                />
                <div className='grid grid-cols-2 gap-4'>
                <Input
                    // crossOrigin={false}
                    label="Phone"
                    name="phone"
                    value={contact.phone}
                    onChange={handleOnChangeContact}
                    className="col-span-2 md:col-span-1"
                />
                <Input
                    // crossOrigin={false}
                    label="Telephone"
                    name="tel"
                    value={contact.tel}
                    onChange={handleOnChangeContact}
                    className="col-span-2 md:col-span-1"
                />
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
