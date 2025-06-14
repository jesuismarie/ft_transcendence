// import {Cubit} from "@/core/framework/bloc/cubit";
// import {ModalsState} from "@/presentation/features/modals/bloc/modalsState";
//
// export enum ModalType {
//     search,
//     friends,
//     tournament,
//     editProfile
// }
//
// export class ModalsBloc extends Cubit<ModalsState> {
//     constructor() {
//         super(new ModalsState({}));
//     }
//     onOpenModal(modalType: ModalType): void  {
//         switch (modalType) {
//             case ModalType.search:
//                 this.emit(this.state.copyWith({isSearchModalOpen: true}));
//                 break;
//             case ModalType.friends:
//                 this.emit(this.state.copyWith({isFriendsModalOpen: true}));
//                 break;
//             case ModalType.tournament:
//                 this.emit(this.state.copyWith({isTournamentModalOpen: true}));
//                 break;
//             default:
//                 return;
//         }
//     }
//
//     onCloseModal(modalType: ModalType): void {
//         switch (modalType) {
//             case ModalType.search:
//                 this.emit(this.state.copyWith({isSearchModalOpen: false}));
//                 break;
//             case ModalType.friends:
//                 this.emit(this.state.copyWith({isFriendsModalOpen: false}));
//                 break;
//             case ModalType.tournament:
//                 this.emit(this.state.copyWith({isTournamentModalOpen: false}));
//                 break;
//             default:
//                 return;
//         }
//     }
// }
