import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type Widget} from "@/core/framework/core/base";
import {showError} from "@/utils/error_messages";
import {hideModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {type TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {TextController} from "@/core/framework/controllers/textController";
import {SelectController} from "@/core/framework/controllers/selectController";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {showFlushBar} from "@/presentation/common/widget/flushBar";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";


export class AddTournament extends StatelessWidget {

    constructor(public parentId?: string) {
        super();
    }


    nameInputController: TextController = new TextController()
    capacityInputController: SelectController = new SelectController()

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const nameInput = document.getElementById("tournament-name") as HTMLInputElement | null;
        const capacityInput = document.getElementById("tournament-capacity") as HTMLSelectElement | null;

        if (nameInput) {
            this.nameInputController.bindInput(nameInput!);
        }
        if (capacityInput) {
            this.capacityInputController.bindSelect(capacityInput!)
        }
    }
    static isSendRequest = false;

    build(context: BuildContext): Widget {
        return new BlocListener<TournamentBloc, TournamentState>(
            {
                listener: (context: BuildContext, state) => {
                    if (!state.isValid) {
                        showError("add_tournament", "Please enter a tournament name.");
                    }
                    if (state.status == TournamentStatus.ErrorCreate) {
                        showError('add_tournament', state.errorMessage ?? "Failed to add tournament. Please try again.");
                    }
                    if (state.status == TournamentStatus.Error) {
                        showFlushBar({message: state.errorMessage ?? "Failed to add tournament. Please try again."});
                        context.read(TournamentBloc).resetAfterSubmit();
                    }
                    if (state.status == TournamentStatus.Created) {
                        hideModal(ModalConstants.addTournamentModalName)
                    }
                },
                blocType: TournamentBloc,
                child: new DependComposite({dependWidgets: [new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
            <div class="px-4 pt-5 pb-4 sm:p-6">
                <h3 class="text-lg font-medium">
                    Add Tournament
                </h3>
                <div class="mt-4 space-y-4">
                    <label for="tournament-name" class="block text-sm font-medium">Tournament Name</label>
                    <input type="text" id="tournament-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                    <p class="error-msg text-red-500 text-sm" data-error-for="add_tournament"></p>
                    <label for="tournament-capacity" class="block text-sm font-medium text-gray-700">Tournament Capacity</label>
                    <select id="tournament-capacity" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                    </select>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3">
                <div id="add-tournament-btn-content"></div>
                <div id="close-tournament-btn-content"></div>
            </div>
        </div>`, this.parentId)],
                    children: [
                        new SubmitButton({
                            className: 'px-4 py-2 text-sm rounded-md border border-hover hover:text-hover',
                            id: "close-add-tournament-modal",
                            label: "Close",
                            disabled: false,
                            isHidden: false,
                            onClick: () => {
                                const tournamentBloc = context.read(TournamentBloc);
                                hideModal(ModalConstants.addTournamentModalName)
                                tournamentBloc.resetAfterSubmit()
                            },
                            parentId: 'close-tournament-btn-content'
                        }, ),

                        new SubmitButton({
                            className: 'bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md',
                            id: "add-tournament-btn",
                            label: "Add",
                            disabled: false,
                            isHidden: false,
                            onClick: () => {
                                const tournamentBloc = context.read(TournamentBloc);
                                const profileBloc = context.read(ProfileBloc);
                                const max_player_count = parseInt(this.capacityInputController.value)
                                tournamentBloc.validateTournament(this.nameInputController.text)
                                if (profileBloc.state.profile?.id) {
                                    tournamentBloc.createTournament(this.nameInputController.text, max_player_count, profileBloc.state.profile?.id).then(r => r)
                                    AddTournament.isSendRequest = true
                                }
                            },
                            parentId: 'add-tournament-btn-content'
                        }),

                    ]})
            });
    }


}