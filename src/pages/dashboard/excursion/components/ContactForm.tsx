import React from "react";
import {Input} from "@material-tailwind/react";
import {IContact} from "@/models/contactModel";
import InputMask from "react-input-mask";
import {IMaskInput} from "@/models/interfaces/InputMask.interfaces";

interface ContactFormProps {
    contact: IContact;
    updateContact: (contact: IContact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({contact = {} as any, updateContact}) => {
    const handleOnChangeContact = ({target: {name, value, type}}: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'tel') {
            value = value.replace(/[^0-9]/g, '');
            if (value === '1') return;
        }

        updateContact({...contact, [name]: value});
    };

    return (
        <div className="space-y-4">
            <div className="w-full grid grid-cols-1 gap-4">

                <Input
                    crossOrigin={false}
                    label="Email"
                    name="email"
                    value={contact.email}
                    onChange={handleOnChangeContact}
                    className="col-span-2"
                />
                <div className='grid grid-cols-2 gap-4'>
                    <InputMask
                        mask="+1 (999) 999-9999"
                        name="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={handleOnChangeContact}
                        maskPlaceholder={null}
                        alwaysShowMask={false}
                    >
                        {
                            ((inputProps: IMaskInput) => (
                                <Input
                                    crossOrigin={false}
                                    {...inputProps}
                                    type="tel"
                                    label="Celular"
                                />
                            )) as any}
                    </InputMask>
                    <InputMask
                        mask="+1 (999) 999-9999"
                        name="tel"
                        type="tel"
                        value={contact.tel}
                        onChange={handleOnChangeContact}
                        maskPlaceholder={null}
                        alwaysShowMask={false}
                    >
                        {
                            ((inputProps: IMaskInput) => (
                                <Input
                                    crossOrigin={false}
                                    {...inputProps}
                                    type="tel"
                                    label="Telefono"
                                />
                            )) as any}
                    </InputMask>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
