import {IPayment} from "../models/PaymentModel";
import {IService} from "../models/serviceModel";
import {IFinance} from "../models/financeModel";
import {IClient} from "../models/clientModel";
import {IMedia} from "../models/mediaModel";
import {IContact} from "../models/contactModel";
import {ILocation} from "../models/ordersModels";
import {IActivity} from "../models/activitiesModel";
import {IReview} from "../models/reviewsModel";
import {IComments} from "../models/commentModel";
import {ISocialNetwork} from "../models/ISocialNetwork";
import {IOrganization} from "../models/organizationModel";
import {IBus} from "../models/busesModel";
import {ICheckpoint} from "../models/checkpointModel";
import {ITransport} from "../models/transportModel";
import {IFood} from "../models/foodModel";
import {IProjection} from "../models/projectionModel";
import {IExcursion} from "../models/excursionModel";
import IUser from "../models/interfaces/userModel";

const richTextActivity = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marriage Conference</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1, h2 {
            color: #4CAF50;
        }
        p {
            line-height: 1.6;
        }
        .preacher {
            font-weight: bold;
        }
        .activity {
            margin-top: 20px;
        }
        .activity h3 {
            color: #FF5722;
        }
        .activity p {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Marriage Conference</h1>
        <p>Welcome to our Marriage Conference, where couples come together to strengthen their bonds and learn from each other. Join us for an enlightening experience led by our special preacher, Reverend John Smith.</p>
        
        <div class="activity">
            <h2>Dynamics of the Conference:</h2>
            <p>During this conference, we will engage in various interactive activities and discussions designed to deepen your understanding of each other and enhance your relationship. Expect insightful talks, group exercises, and opportunities to share your experiences with other couples.</p>
        </div>
        
        <div class="activity">
            <h3>Special Preacher: Reverend John Smith</h3>
            <p>Reverend John Smith is a renowned marriage counselor with decades of experience in guiding couples towards a fulfilling and harmonious relationship. His unique insights and compassionate approach have helped countless couples overcome challenges and build strong foundations for their marriages.</p>
            <p>Don't miss this chance to learn from Reverend Smith and gain valuable insights that can transform your relationship!</p>
        </div>
        
        <div class="activity">
            <h2>Event Details:</h2>
            <p><strong>Date:</strong> June 15th, 2024</p>
            <p><strong>Time:</strong> 9:00 AM - 4:00 PM</p>
            <p><strong>Location:</strong> Gardenia Conference Center, 123 Main Street, Anytown, USA</p>
            <p><strong>Registration:</strong> Please register online at <a href="#">www.marriageconference.com</a></p>
        </div>
    </div>
</body>
</html>

`

export const mockBedrooms = [
    {
        capacity: 2,
        name: 'Standard Room',
        zone: 'North',
        level: 1
    },
    {
        capacity: 4,
        name: 'Family Room',
        zone: 'South',
        level: 2
    }
];

const mockUser: IUser = {
    username: "username",
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    role: "role",
    password: "password",
};

const mockSocialNetwork: ISocialNetwork = {
    type: 'instagram',
    url: 'https://instagram.com/exampleuser',
    username: 'exampleuser',
    company: 'examplecompany',
};
export const mockFinance: IFinance = {
    price: 1500,
    cost: 1200,
    type: 'excursion'
};

export const mockLocation: ILocation = {
    address: '1234 Street Blvd',
    city: 'MetroCity',
    province: 'MetroProvince',
    country: 'Metroland',
    latitude: 18.474163,
    longitude: -69.9979178,
    link: 'https://maps.example.com/location',
    description: 'A beautiful location.'
};


export const mockPayment: IPayment = {
    type: 'card',
    date: new Date(),
    amount: 100.00,
    comment: 'Payment for excursion.'
};

export const mockService: IService = {
    status: 'reserved',
    payments: [mockPayment, mockPayment, mockPayment],
    type: 'excursion',
    finance: mockFinance,
    excursionId: '1234',
};


export const mockClient: IClient = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    stage: 'new',
    email: 'john.doe@example.com',
    deleted: false,
    services: [mockService],
    socialNetworks: [mockSocialNetwork]
};


export const mockMedia: IMedia = {
    type: 'image',
    content: 'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg',
    title: 'A Beautiful Sunset'
};

export const mockMediaVideo: IMedia = {
    type: 'video',
    // content: 'https://storage.googleapis.com/download/storage/v1/b/betuel-tech-photos/o/dixybaby-video-1694811200102.mp4?generation=1694811200886738&alt=media',
    content: 'https://www.youtube.com/watch?v=mPCN1irKfkc',
    title: '100 Anios de Soledad'
};

export const mockMediaAudio: IMedia = {
    type: 'audio',
    content: 'https://storage.googleapis.com/betuel-tech-photos/66184a3768b4aad8b6876819-bible-audio-1713193273544.ogg',
    title: 'Anuncio'
};

export const mockComment: IComments = {
    text: 'Great experience!',
    medias: [mockMedia]
};
export const mockContact: IContact = {
    location: mockLocation,
    tel: '+1987654321',
    phone: '+1987654321'
};


export const mockActivity: IActivity = {
    title: 'Hiking Adventure',
    images: [mockMedia],
    videos: [mockMedia],
    date: new Date(),
    description: richTextActivity
};

export const mockActivity2: IActivity = {
    title: 'Swimming',
    images: [mockMedia],
    videos: [mockMedia],
    date: new Date(),
    description: 'A day-long hiking trip.'
};


export const mockReview: IReview = {
    client: mockClient,
    comment: mockComment,
    stars: 5
};

export const mockOrganization: IOrganization = {
    _id: '1234',
    type: 'tourist-spot',
    name: 'Historic Site',
    description: 'A popular historic site.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPUsJq2dUgyqtHLTH3eO6jAWaqutCg-vbZRROjGqtIgg&s',
    socialNetworks: [mockSocialNetwork],
    medias: [mockMedia, mockMediaVideo],
    contact: mockContact,
    reviews: [mockReview],
    bedrooms: mockBedrooms
};

export const mockBus: IBus = {
    model: 'Volvo 2020',
    driver: mockUser,
    capacity: 40,
    color: 'blue',
    description: 'Comfortable seating and WiFi.'
};

export const mockCheckpoint: ICheckpoint = {
    location: mockLocation,
    description: 'Lunch stop',
    buses: [mockBus]
};

export const mockTransport: ITransport = {
    finance: mockFinance,
    organization: mockOrganization,
    transportResources: [mockBus]
};

export const mockFood: IFood = {
    organization: mockOrganization,
    finance: mockFinance,
    menu: 'Daily Specials Menu',
    type: 'lunch'
};


export const mockProjection: IProjection = {
    finance: mockFinance,
    clients: 100,
    date: new Date(),
    done: false
};



export const mockExcursion: IExcursion = {
    title: 'Beach Day',
    description: 'A fun day at the beach.',
    destinations: [mockOrganization],
    organizations: [mockOrganization],
    clients: [mockClient],
    finance: mockFinance,
    checkpoints: [mockCheckpoint, mockCheckpoint, mockCheckpoint],
    flyer: mockMedia,
    images: [mockMedia],
    videos: [mockMediaVideo],
    audios: [mockMediaAudio],
    activities: [mockActivity, mockActivity2],
    reviews: [mockReview],
    transport: mockTransport,
    foods: [mockFood],
    projections: [
        mockProjection,
        {
            finance: {
                price: 2000,
                cost: 1500,
                type: 'excursion'
            },
            clients: 200,
            date: new Date("10/10/2024"),
            done: false
        },
        {
            finance: {
                price: 4000,
                cost: 1500,
                type: 'excursion'
            },
            clients: 300,
            date: new Date("10/10/2024"),
            done: false
        },
    ],
    startDate: new Date("11/11/2024"),
    endDate: new Date("12/12/2024")
};