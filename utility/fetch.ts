import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

async function fetchData(options: any): Promise<any> {
  options.url = `${API_BASE_URL}${options.url}`;
  const { data } = await axios.request(options);
  return data;
}

export async function signIn(
  username: string,
  password: string,
): Promise<{
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}> {
  return fetchData({
    method: "POST",
    url: "/signin",
    headers: { "Content-Type": "application/json" },
    data: { username, password },
  });
}

export async function autoSignIn(): Promise<{
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}> {
  return fetchData({
    method: "GET",
    url: "/auto-signin",
    withCredentials: true,
  });
}

type System = {
  id: string;
  name: string;
  timeZone: string;
  fetchedAt: number;
  address: {
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }[];
};

type FetchSystemsResponse = {
  total: number;
  page: number;
  pageSize: number;
  systems: System[];
};

export async function getSystems(
  brand: string,
  page: number,
  pageSize: number,
): Promise<FetchSystemsResponse> {
  return fetchData({
    method: "GET",
    url: `/systems?brand=${brand}&page=${page}&pageSize=${pageSize}`,
    withCredentials: true,
  });
}

type Inverter = {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  mppTrackerCount: number;
  isActive: boolean;
};

type FetchInvertersResponse = {
  count: number;
  inverters: Inverter[];
};

export async function getInverterDetails(
  sysId: string,
): Promise<FetchInvertersResponse> {
  return fetchData({
    method: "GET",
    url: `/inverters/${sysId}`,
    withCredentials: true,
  });
}

type EnergyDataPoint = {
  logTime: string;
  energy_produced: number;
};

type InverterEnergyPoints = {
  systemId: string;
  inverterId: string;
  gathered_intervals: number;
  stats: EnergyDataPoint[];
};

export async function getInverterEnergyPoints(
  sysId: string,
  inverterId: string,
  params: {
    dateString: string;
    squash: boolean;
  },
): Promise<InverterEnergyPoints> {
  return fetchData({
    method: "GET",
    url: `/archives/${sysId}/inv/${inverterId}?dateString=${params.dateString}&squash=${params.squash}`,
    withCredentials: true,
  });
}

export type SystemEnergyPoints = {
  systemId: string;
  gathered_intervals: number;
  squashed: boolean;
  stats: Partial<InverterEnergyPoints>[];
};

// extremely slow as each inverter needs 1 min 30 sec to fetch 1 year of data
// can't consider parallel because of rate limiting of solar brands APIs.
export async function getSystemEnergyPoints(
  sysId: string,
  params: {
    dateString: string;
    squash: boolean;
  },
): Promise<SystemEnergyPoints> {
  const inverters = await getInverterDetails(sysId);
  if (inverters.count === 0) {
    throw new Error("No inverters found for this system");
  }
  const energyPoints = {
    systemId: sysId,
    gathered_intervals: 0,
    squashed: params.squash,
    stats: [] as Partial<InverterEnergyPoints>[],
  };
  // sequentially fetch energy points for each inverter
  // may take a max time of inverter count * 1 min 30 sec for 1 year data
  for (const inverter of inverters.inverters) {
    const points = await getInverterEnergyPoints(sysId, inverter.id, params);
    energyPoints.stats.push({
      inverterId: inverter.id,
      gathered_intervals: points.gathered_intervals,
      stats: points.stats,
    });
    energyPoints.gathered_intervals += points.gathered_intervals;
  }
  return energyPoints;
}
