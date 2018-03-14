export interface ILabeler {
  labelerId?: string;
  labelerName?: string;
  labelerDescription?: string;
  labelerNin?: string;
  labelerTypeId?: string;
  labelerStatusId?: string;
  labelerDisableDate?: string;
  labelerAddress?: string;
  labelerTambon?: string;
  labelerAmpur?: string;
  labelerProvince?: string;
  labelerZipCode?: string;
  labelerPhone?: string;
  labelerUrl?: string;
  labelerMophId?: string;
  labelerRegisterDate?: string;
}

export interface IOrganization {
  orgNo?: string;
  orgYearRegister?: string;
  orgYearEstablished?: string;
  orgCountry?: string;
  orgFADNumber?: string;
  orgLatitude?: number;
  orgLongitude?: number;
}

export interface ILabelerStructure {
  labeler_id?: string;
  labeler_name?: string;
  description?: string;
  nin?: string;
  labeler_type?: string;
  labeler_status?: string;
  disable_date?: string;
  address?: string;
  tambon_code?: string;
  ampur_code?: string;
  province_code?: string;
  zipcode?: string;
  phone?: string;
  url?: string;
  register_date?: string,
  moph_labeler_id?: string
}

export interface IOrganizationStructure {
  labeler_id?: string;
  org_no?: string;
  year_register?: string;
  year_established?: string;
  country_code?: string;
  fda_no?: string;
  latitude?: number;
  longitude?: number;
}