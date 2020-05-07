import OrgSelect from './select/OrgSelect'
import CustomerSelect from './select/CustomerSelect'
import StationSelect from './select/StationSelect'
import GeneralTable from './util/GeneralTable'
import UploadImage from './upload/UploadImage'
import UploadFile from './upload/UploadFile'
import NewUploadFile from './upload/NewUploadFile'
import UploadPicture from './upload/UploadPicture'
import UploadPictureSmall from './upload/UploadPictureSmall'
import DataDictionarySelect from './select/DataDictionarySelect'
import DataDictionaryMultipleSelect from './select/DataDictionaryMultipleSelect'
import VehicleOwnerSelect from './select/VehicleOwnerSelect'
import DataDictionaryName from './select/DatadictionaryName'
import ShowImage from './upload/ShowImage'
import ShowImageAndFile from './upload/ShowImageAndFile'
import ShowImageT from './upload/ShowImageT'
import DistrictSelect from './select/DistrictSelect'
import SupplierSelect from './select/SupplierSelect'
import DriverSelect from './select/DriverSelect'
import InformationDepartSelect from './select/InformationDepartSelect'
import VehicleSelect from './select/VehicleSelect'
import LineSelect from './select/LineSelect'
import SettlementSelect from './select/SettlementCustomerSelect'
import UserSelect from './select/UserSelect'
import OilCard from './select/OilCardSelect'
import JdVehicleTypeSelect from './select/JdVehicleTypeSelect'
import EtcSelect from './select/EtcSelect'
import uploadExcel from './upload/UploadExcel'
import GasStationSelect from './select/GasStationSelect'
import CurrentOrgSelect from './select/CurrentOrgSelect'
import GpsSelect from './select/GpsSelect'
import RefuelingSupplierSelect from './select/RefuelingSupplierSelect'
import DatePickerSingle from './select/DatePickerSingle'
import DateTimePickerSingle from './select/DateTimePickerSingle'
import PermissionSelect from './select/PermissionSelect'
import PdaSelect from './select/PdaSelect'
import batchInput from './batch/batchInput'
import exportButton from './export/exportButton'
import DingTalkAutidTypeSelect from './select/DingTalkAutidTypeSelect'
import AuditApproversSelect from './select/AuditApproversSelect'
import AllUserSelect from './select/AllUserSelect'
import UploadImageRecognition from  './upload/UploadImageAndRecognition'
import UploadVehicleCert from './upload/UploadVehicleCert'
import OrgSelectReport from  './select/OrgSelectReport'
import OilStationSelect from  './select/OilStationSelect'
import MultipleUserSelect from  './select/MultipleUserSelect'
import IncomeSubjectSelect from  './select/IncomeSubjectSelect'
import MultipleOrgSelect from  './select/MultipleOrgSelect'


const component = {
    install:function(Vue){
        Vue.component('org-select',OrgSelect);
        Vue.component('multiple-org-select',MultipleOrgSelect);
        Vue.component('customer-select',CustomerSelect);
        Vue.component('station-select',StationSelect);
        Vue.component('oil-station-select',OilStationSelect);
        Vue.component('upload-image',UploadImage);
        Vue.component('uploadImage-Recognition',UploadImageRecognition);
        Vue.component('UploadFile',UploadFile);
        Vue.component('new-upload-file',NewUploadFile);
        Vue.component('UploadPicture',UploadPicture);
        Vue.component('upload-picture-small',UploadPictureSmall);
        Vue.component('GeneralTable',GeneralTable);
        Vue.component('dictionary-select',DataDictionarySelect);
        Vue.component('dictionary-multiple-select', DataDictionaryMultipleSelect);
        Vue.component('dictionary-select-name',DataDictionaryName);
        Vue.component('vehicle-owner-select',VehicleOwnerSelect);
        Vue.component('show-image',ShowImage);
        Vue.component('show-image-and-file',ShowImageAndFile);
        Vue.component('show-image-t',ShowImageT);
        Vue.component('district-select',DistrictSelect);
        Vue.component('SupplierSelect',SupplierSelect);
        Vue.component('DriverSelect',DriverSelect);
        Vue.component('informationDepart-select',InformationDepartSelect);
        Vue.component('vehicle-select',VehicleSelect);
        Vue.component('line-select',LineSelect);
        Vue.component('settlement-customer-select',SettlementSelect);
        Vue.component('user-select',UserSelect);
        Vue.component('oil-card-select',OilCard);
        Vue.component('etc-select',EtcSelect);
        Vue.component('gas-station-select',GasStationSelect);
        Vue.component('current-org-select',CurrentOrgSelect);
        Vue.component('org-select-report',OrgSelectReport);
        Vue.component('upload-excel',uploadExcel);
        Vue.component('gps-select',GpsSelect);
        Vue.component('refueling-supplier-select',RefuelingSupplierSelect);
        Vue.component('date-picker-single',DatePickerSingle);
        Vue.component('date-time-picker-single',DateTimePickerSingle);
        Vue.component('PermissionSelect',PermissionSelect);
        Vue.component('pda-select',PdaSelect);
        Vue.component('batch-input',batchInput);
        Vue.component('export-button',exportButton);
        Vue.component('pda-select',PdaSelect)
        Vue.component('ding-talk-autid-type-select',DingTalkAutidTypeSelect)
        Vue.component('audit-approvers-select',AuditApproversSelect)
        Vue.component('all-user-select',AllUserSelect);
        Vue.component('upload-vehicle-cert',UploadVehicleCert);
        Vue.component('jd-vehicle-type-select',JdVehicleTypeSelect);
        Vue.component('multiple-user-select',MultipleUserSelect);
        Vue.component('income-subject-select',IncomeSubjectSelect);
    }
};
export default component;
