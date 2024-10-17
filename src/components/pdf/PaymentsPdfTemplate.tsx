import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Link,
} from '@react-pdf/renderer';

import pdfStyles from './PrintStyles';
import {IPayment} from "@/models/PaymentModel";
import IUser from "@/models/interfaces/userModel";
import {IClient} from "@/models/clientModel";


const PaymentPDF = ({title, client, payments, user}: {
    title: string | undefined,
    client: IClient | undefined,
    payments: IPayment[],
    user: IUser | null
}) => {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return (
        <Document>
            <Page style={pdfStyles.page}>
                <View style={pdfStyles.titleContainer}>
                    <Image style={pdfStyles.logo} src={user?.organization.logo.content}/>
                    <Text style={pdfStyles.title}>
                        Reporte de Pago
                    </Text>
                </View>

                {/* Información del Usuario */}
                <View style={pdfStyles.sectionContainer}>
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Información del Cliente</Text>
                        {user ? (
                            <>
                                <View style={pdfStyles.row}>
                                    <Text style={pdfStyles.label}>Nombre:</Text>
                                    <Text style={pdfStyles.value}>{client?.firstName} {client?.lastName}</Text>
                                </View>
                                <View style={pdfStyles.row}>
                                    <Text style={pdfStyles.label}>Teléfono:</Text>
                                    <Text style={pdfStyles.value}>{client?.phone}</Text>
                                </View>
                                <View style={pdfStyles.row}>
                                    <Text style={pdfStyles.label}>Email:</Text>
                                    <Text style={pdfStyles.value}>{client?.email || 'N/A'}</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={pdfStyles.value}>Cliente no disponible</Text>
                        )}
                    </View>

                    {/* Información de los Pagos */}
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Información de Pago</Text>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Excursion:</Text>
                            <Text style={pdfStyles.value}>{title}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Fecha:</Text>
                            <Text style={pdfStyles.value}>{new Date().toLocaleDateString()}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Monto Total:</Text>
                            <Text style={pdfStyles.value}>${totalAmount}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabla de pagos */}
                <Text style={pdfStyles.sectionTitle}>Pagos</Text>
                <View style={pdfStyles.table}>
                    <View style={pdfStyles.tableHeader}>
                        <Text style={pdfStyles.tableHeaderCell}>Fecha</Text>
                        <Text style={pdfStyles.tableHeaderCell}>Tipo de Pago</Text>
                        <Text style={pdfStyles.tableHeaderCell}>Monto</Text>
                        <Text style={pdfStyles.tableHeaderCell}>Comprobante</Text>
                        <Text style={pdfStyles.tableHeaderCell}>Comentario</Text>
                    </View>
                    {payments.map((payment) => (
                        <View key={payment._id} style={pdfStyles.tableRow}>
                            <Text style={pdfStyles.tableBodyCell}>{new Date(payment.date).toLocaleDateString()}</Text>
                            <Text style={pdfStyles.tableBodyCell}>{payment.type}</Text>
                            <Text style={pdfStyles.tableBodyCell}>${payment.amount}</Text>
                            <Text style={pdfStyles.tableBodyCell}>
                                {payment.media ? (
                                    <Link src={payment.media.content}>
                                        Ver archivo
                                    </Link>
                                ) : (
                                    'Sin archivo'
                                )}
                            </Text>
                            <Text style={pdfStyles.tableBodyCell}>{payment.comment || 'N/A'}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PaymentPDF;
