import {
  Commander,
  Fragment,
  BranchAbstractComponent,
  DivisionAbstractComponent,
  TBRangeScope, BackboneAbstractComponent, CommandContext, TBRange
} from '../../core/_api';
import { ListComponent, BlockComponent } from '../../components/_api';

interface ContentPosition {
  startIndex: number;
  endIndex: number;
  fragment: Fragment;
}

export class ListCommander implements Commander<null> {
  recordHistory = true;

  constructor(private tagName: 'ol' | 'ul') {
  }

  command(context: CommandContext): void {
    const {selection, overlap} = context;
    selection.ranges.forEach(range => {
      if (overlap) {
        range.getSlotRange(ListComponent, instance => instance.tagName === this.tagName).forEach(item => {
          const slots = item.component.split(item.startIndex, item.endIndex);
          const parentFragment = item.component.parentFragment;
          if (slots.before.length) {
            const beforeList = new ListComponent(this.tagName);
            beforeList.slots.push(...slots.before);
            parentFragment.insertBefore(beforeList, item.component);
          }
          if (slots.center.length) {
            slots.center.forEach(fragment => {
              if (fragment.contentLength === 1 && fragment.getContentAtIndex(0) instanceof BranchAbstractComponent) {
                parentFragment.insertBefore(fragment.getContentAtIndex(0) as BranchAbstractComponent, item.component)
              } else {
                const t = new BlockComponent('p');
                if (fragment === range.startFragment) {
                  range.startFragment = t.slot;
                }
                if (fragment === range.endFragment) {
                  range.endFragment = t.slot;
                }
                t.slot.from(fragment);
                parentFragment.insertBefore(t, item.component);
              }
            })
          }
          if (slots.after.length) {
            const afterList = new ListComponent(this.tagName);
            afterList.slots.push(...slots.after);
            parentFragment.insertBefore(afterList, item.component);
          }
          parentFragment.cut(parentFragment.indexOf(item.component), 1);
        })
      } else {
        const commonScope = range.getCommonAncestorFragmentScope();
        const commonAncestorFragment = range.commonAncestorFragment;
        const startFragment = range.startFragment;


        const scopes = this.getMovableContents(range, commonAncestorFragment);
        const list = this.buildNewList(scopes, commonAncestorFragment, range);

        if (startFragment !== commonAncestorFragment) {
          if (commonAncestorFragment.indexOf(commonScope.startChildComponent) !== -1) {
            commonAncestorFragment.insertAfter(list, commonScope.startChildComponent);
          } else {
            commonAncestorFragment.insert(list, commonScope.startIndex);
          }
        } else {
          const parentComponent = commonAncestorFragment.parentComponent;
          if (parentComponent instanceof DivisionAbstractComponent || parentComponent instanceof BackboneAbstractComponent) {
            const parentFragment = parentComponent.parentFragment;
            const position = parentFragment.indexOf(parentComponent);
            parentFragment.cut(position, 1);
            parentFragment.insert(list, position);
          } else if (parentComponent instanceof BranchAbstractComponent) {
            const index = parentComponent.slots.indexOf(commonAncestorFragment);
            const before = parentComponent.clone() as BranchAbstractComponent;
            before.slots.splice(index);
            const after = parentComponent.clone() as BranchAbstractComponent;
            after.slots.splice(0, index + 1);

            const parentFragment = parentComponent.parentFragment;
            const position = parentFragment.indexOf(parentComponent);

            if (after.slots.length) {
              parentFragment.insert(after, position)
            }
            parentFragment.insert(list, position);
            if (before.slots.length) {
              parentFragment.insert(before, position);
            }
            parentFragment.cut(parentFragment.indexOf(parentComponent), 1);
          }
        }
      }
    })
  }

  private buildNewList(scopes: ContentPosition[],
                       commonAncestorFragment: Fragment,
                       range: TBRange) {
    const list = new ListComponent(this.tagName);
    scopes.reverse().forEach(scope => {
      if (scope.startIndex === 0 && scope.endIndex === scope.fragment.contentLength && scope.fragment !== commonAncestorFragment) {
        range.deleteEmptyTree(scope.fragment, commonAncestorFragment);
        list.slots.unshift(scope.fragment);
        return;
      }
      const fragment = new Fragment();
      fragment.from(scope.fragment.cut(scope.startIndex, scope.endIndex - scope.startIndex));

      list.slots.unshift(fragment);
      if (scope.fragment.contentLength === 0) {
        range.deleteEmptyTree(scope.fragment, commonAncestorFragment);
      }
      if (scope.fragment === range.startFragment) {
        range.setStart(fragment, range.startIndex - scope.startIndex);
      }
      if (scope.fragment === range.endFragment) {
        range.setEnd(fragment, range.endIndex - scope.startIndex);
      }
    });
    return list
  }

  private getMovableContents(range: TBRange, commonAncestorFragment: Fragment): ContentPosition[] {
    const scopes: TBRangeScope[] = [];
    const backboneComponents: Array<BackboneAbstractComponent> = [];
    range.getSuccessiveContents().forEach(scope => {
      let fragment = scope.fragment;
      let lastBackboneComponent: BackboneAbstractComponent;
      while (true) {
        if (fragment === commonAncestorFragment) {
          break;
        }
        const parentComponent = fragment.parentComponent;
        fragment = parentComponent.parentFragment;
        if (parentComponent instanceof BackboneAbstractComponent) {
          lastBackboneComponent = parentComponent;
        }
      }
      if (lastBackboneComponent) {
        if (backboneComponents.includes(lastBackboneComponent)) {
          return;
        }
        backboneComponents.push(lastBackboneComponent);
        const parentFragment = lastBackboneComponent.parentFragment;
        const index = parentFragment.indexOf(lastBackboneComponent);
        scopes.push({
          startIndex: index,
          endIndex: index + 1,
          fragment: parentFragment
        })
      } else {
        scopes.push(scope);
      }
    });
    return scopes;
  }
}
