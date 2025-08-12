import { useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { DevOverlayContext } from '../../dev-overlay.browser'
import { RenderErrorContext } from '../dev-overlay'
import { PanelRouterContext, type PanelStateKind } from '../menu/context'
import { INITIAL_OVERLAY_STATE } from '../shared'
import type { OverlayState, DispatcherEvent } from '../shared'
import type { ReadyRuntimeError } from '../utils/get-error-by-type'

interface WithDevOverlayContextsProps {
  state?: Partial<OverlayState>
  dispatch?: (action: DispatcherEvent) => void
  runtimeErrors?: ReadyRuntimeError[]
  totalErrorCount?: number
  panel?: PanelStateKind | null
  setPanel?: Dispatch<SetStateAction<PanelStateKind | null>>
  selectedIndex?: number
  setSelectedIndex?: Dispatch<SetStateAction<number>>
}

export const withDevOverlayContexts =
  (props?: WithDevOverlayContextsProps) => (Story: any) => {
    const [panel, setPanel] = useState<PanelStateKind | null>(
      props?.panel ?? null
    )
    const [selectedIndex, setSelectedIndex] = useState(
      props?.selectedIndex ?? -1
    )
    const triggerRef = useRef<HTMLButtonElement>(null)

    const defaultState: OverlayState = {
      ...INITIAL_OVERLAY_STATE,
      routerType: 'app',
      isErrorOverlayOpen: false,
      ...props?.state,
    }

    const defaultDispatch = props?.dispatch || (() => {})

    return (
      <DevOverlayContext.Provider
        value={{
          state: defaultState,
          dispatch: defaultDispatch,
          getSquashedHydrationErrorDetails: () => null,
        }}
      >
        <RenderErrorContext.Provider
          value={{
            runtimeErrors: props?.runtimeErrors ?? [],
            totalErrorCount: props?.totalErrorCount ?? 0,
          }}
        >
          <PanelRouterContext.Provider
            value={{
              panel,
              setPanel: props?.setPanel ?? setPanel,
              triggerRef,
              selectedIndex,
              setSelectedIndex: props?.setSelectedIndex ?? setSelectedIndex,
            }}
          >
            <Story />
          </PanelRouterContext.Provider>
        </RenderErrorContext.Provider>
      </DevOverlayContext.Provider>
    )
  }
