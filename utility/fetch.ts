import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

async function fetchData(options: any): Promise<any> {
    options.url = `${API_BASE_URL}${options.url}`;
    const { data } = await axios.request(options);
    return data;
}

export async function signIn(username: string, password: string): Promise<{
    accessToken: string,
    expiresIn: number,
    tokenType: string
}> {
    return fetchData({
        method: 'POST',
        url: '/signin',
        headers: { 'Content-Type': 'application/json' },
        data: { username, password }
    });
}

export async function autoSignIn(): Promise<{
    accessToken: string,
    expiresIn: number,
    tokenType: string
}> {
    return fetchData({
        method: 'GET',
        url: '/auto-signin',
        withCredentials: true
    });
}

type System = {
    id: string,
    name: string,
    timeZone: string,
    fetchedAt: number,
    address: {
        city: string,
        state: string,
        country: string,
        zipCode: string
    }[]
}

type FetchSystemsResponse = {
    total: number,
    page: number,
    pageSize: number,
    systems: System[]
}

export async function getSystems(brand:string, page:number , pageSize:number):Promise<FetchSystemsResponse>{
    return fetchData({
        method: 'GET',
        url: `/systems?brand=${brand}&page=${page}&pageSize=${pageSize}`,
        withCredentials: true,
    });
}

type Inverter = {
    id: string,
    name: string,
    model: string,
    serialNumber: string,
    mppTrackerCount: number,
    isActive: boolean
}

type FetchInvertersResponse = {
    count: number,
    inverters: Inverter[]
}

export async function getInverterDetails(sysId: string):Promise<FetchInvertersResponse>{
    return fetchData({
        method: 'GET',
        url: `/inverters/${sysId}`,
        withCredentials: true,
    });
}

type EnergyDataPoint = {
    logTime: string,
    energy_produced: number
}

type InverterEnergyPoints = {
    systemId: string,
    inverterId: string,
    gathered_intervals: number,
    stats: EnergyDataPoint[]
}

export async function getInverterEnergyPoints(sysId: string, inverterId: string, params: {
    dateString: string,
    squash: boolean
}):Promise<InverterEnergyPoints>{
   return fetchData({
       method: 'GET',
       url: `/archives/${sysId}/inv/${inverterId}?dateString=${params.dateString}&squash=${params.squash}`,
       withCredentials: true,
   });
}
