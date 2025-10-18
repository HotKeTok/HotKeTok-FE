export function markCurrentUserUnit(data) {
  const { currentUserId, floors } = data;

  const floorsWithUserMarked = floors.map(floor => {
    const markedUnits = floor.units.map(unit => {
      /// 현재 사용자 주소 인지 확인하고 isCurrentUser 속성 추가
      return {
        ...unit,
        isCurrentUser: unit.userId === currentUserId,
      };
    });

    return {
      ...floor,
      units: markedUnits,
    };
  });

  return floorsWithUserMarked;
}
